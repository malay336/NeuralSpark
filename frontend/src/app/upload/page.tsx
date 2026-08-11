"use client";

import React, { useState, useEffect } from "react";
import { 
  UploadCloud, FileText, PlusCircle, Code, BarChart3, 
  CheckCircle2, AlertCircle, Sparkles, BookOpen, HelpCircle, 
  Video, Brain, Layers, ArrowRight, RefreshCw, FileCode, Check, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadStats {
  pyqs: number;
  questions: number;
  articles: number;
  lectures: number;
  quizzes: number;
  categories: number;
}

export default function UploadPortalPage() {
  const [activeTab, setActiveTab] = useState<"file" | "manual" | "json" | "stats">("file");
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [fileContentType, setFileContentType] = useState<string>("pyq");
  const [fileSubject, setFileSubject] = useState<string>("General CS & AI");
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [fileResult, setFileResult] = useState<{ success: boolean; message: string; details?: string[] } | null>(null);

  // Manual Form State
  const [manualContentType, setManualContentType] = useState<string>("pyq");
  const [manualSubject, setManualSubject] = useState<string>("Algorithms & Data Structures");
  const [manualSubmitting, setManualSubmitting] = useState<boolean>(false);
  const [manualResult, setManualResult] = useState<{ success: boolean; message: string; details?: string[] } | null>(null);

  // PYQ Form Fields
  const [pyqText, setPyqText] = useState("");
  const [pyqAnswer, setPyqAnswer] = useState("");
  const [pyqYear, setPyqYear] = useState<number | "">(2024);
  const [pyqVideoUrl, setPyqVideoUrl] = useState("");

  // Article Form Fields
  const [articleTitle, setArticleTitle] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleContent, setArticleContent] = useState("");

  // Lecture Form Fields
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDesc, setLectureDesc] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");

  // Question Form Fields
  const [qTitle, setQTitle] = useState("");
  const [qBody, setQBody] = useState("");
  const [qTags, setQTags] = useState("Algorithms, GATE");

  // Quiz Form Fields
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question_text: "",
      explanation: "",
      options: [
        { option_text: "", is_correct: true },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ]
    }
  ]);

  // Batch JSON State
  const [jsonContentType, setJsonContentType] = useState<string>("pyq");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonSubmitting, setJsonSubmitting] = useState<boolean>(false);
  const [jsonResult, setJsonResult] = useState<{ success: boolean; message: string; details?: string[] } | null>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/stats/");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle File Upload Submit
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setFileUploading(true);
    setFileResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("content_type", fileContentType);
    formData.append("subject_name", fileSubject);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/file/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setFileResult(data);
      if (data.success) {
        setFile(null);
        fetchStats();
      }
    } catch (err: any) {
      setFileResult({ success: false, message: "Upload failed: " + err.message });
    } finally {
      setFileUploading(false);
    }
  };

  // Handle Manual Form Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualSubmitting(true);
    setManualResult(null);

    let payload: any = { content_type: manualContentType };

    if (manualContentType === "pyq") {
      payload.pyq = {
        question_text: pyqText,
        answer_text: pyqAnswer,
        year: pyqYear ? Number(pyqYear) : null,
        subject_name: manualSubject,
        video_url: pyqVideoUrl || null,
      };
    } else if (manualContentType === "article") {
      payload.article = {
        title: articleTitle,
        summary: articleSummary,
        content: articleContent,
        subject_name: manualSubject,
      };
    } else if (manualContentType === "lecture") {
      payload.lecture = {
        title: lectureTitle,
        description: lectureDesc,
        video_url: lectureUrl,
        subject_name: manualSubject,
      };
    } else if (manualContentType === "question") {
      payload.question = {
        title: qTitle,
        body: qBody,
        tags: qTags.split(",").map((t) => t.trim()),
      };
    } else if (manualContentType === "quiz") {
      payload.quiz = {
        title: quizTitle,
        description: quizDesc,
        subject_name: manualSubject,
        questions: quizQuestions,
      };
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/manual/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setManualResult(data);
      if (data.success) {
        fetchStats();
        // Reset key fields
        setPyqText(""); setPyqAnswer("");
        setArticleTitle(""); setArticleSummary(""); setArticleContent("");
        setLectureTitle(""); setLectureUrl("");
        setQTitle(""); setQBody("");
        setQuizTitle("");
      }
    } catch (err: any) {
      setManualResult({ success: false, message: "Submission error: " + err.message });
    } finally {
      setManualSubmitting(false);
    }
  };

  // Handle Batch JSON Submit
  const handleBatchJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    setJsonSubmitting(true);
    setJsonResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/batch-json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: jsonContentType,
          json_data: jsonInput,
        }),
      });
      const data = await res.json();
      setJsonResult(data);
      if (data.success) {
        fetchStats();
      }
    } catch (err: any) {
      setJsonResult({ success: false, message: "JSON submission error: " + err.message });
    } finally {
      setJsonSubmitting(false);
    }
  };

  // Preset Template for Batch JSON
  const loadSampleJson = (type: string) => {
    setJsonContentType(type);
    if (type === "pyq") {
      setJsonInput(
        JSON.stringify(
          [
            {
              question_text: "What is the height of a balanced binary search tree with N nodes?",
              answer_text: "O(log N)",
              year: 2023,
              is_pyq: true,
              subject_name: "Algorithms & Data Structures"
            },
            {
              question_text: "Which scheduling algorithm is non-preemptive?",
              answer_text: "First-Come First-Served (FCFS)",
              year: 2022,
              is_pyq: true,
              subject_name: "Operating Systems"
            }
          ],
          null,
          2
        )
      );
    } else if (type === "article") {
      setJsonInput(
        JSON.stringify(
          [
            {
              title: "Gradient Descent Optimization Algorithms",
              summary: "Comparison of Batch GD, Stochastic GD, Adam, and RMSprop.",
              content: "# Optimization Algorithms\nAdam optimizer combines ideas from RMSprop and AdaGrad.",
              subject_name: "Machine Learning & AI"
            }
          ],
          null,
          2
        )
      );
    } else if (type === "quiz") {
      setJsonInput(
        JSON.stringify(
          [
            {
              title: "Data Structures Diagnostic Quiz",
              description: "Quick 5-minute refresher quiz",
              subject_name: "Algorithms & Data Structures",
              questions: [
                {
                  question_text: "Which data structure follows LIFO principle?",
                  explanation: "Stacks operate on Last-In First-Out (LIFO).",
                  options: [
                    { option_text: "Queue", is_correct: false },
                    { option_text: "Stack", is_correct: true },
                    { option_text: "Heap", is_correct: false }
                  ]
                }
              ]
            }
          ],
          null,
          2
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              NeuralSpark Content Ingestion Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Content & Question Upload Portal
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Upload Previous Year Questions (PYQs), theory articles, video lectures, practice quizzes, and community Q&A into NeuralSpark using files, forms, or batch JSON.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loadingStats ? "animate-spin" : ""}`} />
            Refresh Stats
          </button>
        </div>

        {/* Stats Overview Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: "PYQs", count: stats?.pyqs ?? 0, icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
            { title: "Questions", count: stats?.questions ?? 0, icon: Brain, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20" },
            { title: "Articles", count: stats?.articles ?? 0, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
            { title: "Lectures", count: stats?.lectures ?? 0, icon: Video, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
            { title: "Quizzes", count: stats?.quizzes ?? 0, icon: Layers, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
            { title: "Categories", count: stats?.categories ?? 0, icon: BarChart3, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className={`${item.bg} border border-gray-200 dark:border-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-xs`}>
                <div className={`p-2.5 rounded-xl bg-white dark:bg-gray-900 ${item.color} shadow-xs`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.title}</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{item.count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          {[
            { id: "file", label: "File Upload (.json, .csv, .pdf, .md)", icon: UploadCloud },
            { id: "manual", label: "Manual Entry Form", icon: PlusCircle },
            { id: "json", label: "Batch JSON Paste", icon: Code },
            { id: "stats", label: "Database Overview", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: FILE UPLOAD */}
          {activeTab === "file" && (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-blue-600" />
                  Bulk File Upload
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ingest content automatically by uploading <b>.json</b>, <b>.csv</b>, <b>.md</b>, <b>.txt</b>, or <b>.pdf</b> files.
                </p>
              </div>

              <form onSubmit={handleFileUpload} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Target Content Type
                    </label>
                    <select
                      value={fileContentType}
                      onChange={(e) => setFileContentType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="pyq">PYQ / Practice Question</option>
                      <option value="article">Theory Article (Markdown / PDF)</option>
                      <option value="quiz">Practice Quiz (MCQs)</option>
                      <option value="lecture">Video Lecture</option>
                      <option value="question">Community Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Subject / Category
                    </label>
                    <select
                      value={fileSubject}
                      onChange={(e) => setFileSubject(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {["LINEAR ALGEBRA", "PROBABILITY", "CALCULUS", "PYTHON PROGRAMMING", "DATA STRUCTURE & ALGORITHM", "MACHINE LEARNING", "AI", "GENERAL APTITUDE"].map((subj) => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 text-center bg-gray-50/50 dark:bg-gray-950/40 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".json,.csv,.md,.txt,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                      <FileCode className="h-8 w-8" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5">
                          <Check className="h-4 w-4" /> Selected: {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          Click to browse or drag and drop your file here
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Supported Formats: JSON, CSV, Markdown (.md), Plain Text (.txt), PDF
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!file || fileUploading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {fileUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Ingesting File...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" /> Upload & Parse File
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Result Banner */}
              {fileResult && (
                <div
                  className={`p-4 rounded-2xl border text-sm ${
                    fileResult.success
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {fileResult.success ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-rose-500" />}
                    {fileResult.message}
                  </div>
                  {fileResult.details && fileResult.details.length > 0 && (
                    <ul className="mt-2 text-xs space-y-1 list-disc list-inside font-mono">
                      {fileResult.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: MANUAL FORM */}
          {activeTab === "manual" && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-purple-600" />
                  Manual Content Entry Form
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Create individual questions, articles, lectures, or quizzes directly into the database.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Select Content Type
                    </label>
                    <select
                      value={manualContentType}
                      onChange={(e) => setManualContentType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="pyq">PYQ / Practice Question</option>
                      <option value="article">Theory Article</option>
                      <option value="lecture">Video Lecture</option>
                      <option value="question">Community Question</option>
                      <option value="quiz">Practice Quiz (MCQ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Subject Category
                    </label>
                    <select
                      value={manualSubject}
                      onChange={(e) => setManualSubject(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      {["LINEAR ALGEBRA", "PROBABILITY", "CALCULUS", "PYTHON PROGRAMMING", "DATA STRUCTURE & ALGORITHM", "MACHINE LEARNING", "AI", "GENERAL APTITUDE"].map((subj) => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DYNAMIC FIELDS PER CONTENT TYPE */}
                
                {/* 1. PYQ */}
                {manualContentType === "pyq" && (
                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Question Text</label>
                      <textarea
                        rows={3}
                        value={pyqText}
                        onChange={(e) => setPyqText(e.target.value)}
                        placeholder="Enter question text or problem statement..."
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Answer / Explanation Text</label>
                      <textarea
                        rows={3}
                        value={pyqAnswer}
                        onChange={(e) => setPyqAnswer(e.target.value)}
                        placeholder="Detailed answer explanation..."
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Exam Year (Optional)</label>
                        <input
                          type="number"
                          value={pyqYear}
                          onChange={(e) => setPyqYear(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g. 2024"
                          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Video Explanation URL (Optional)</label>
                        <input
                          type="url"
                          value={pyqVideoUrl}
                          onChange={(e) => setPyqVideoUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ARTICLE */}
                {manualContentType === "article" && (
                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Article Title</label>
                      <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="e.g. Complete Guide to Backpropagation"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Summary / Abstract</label>
                      <input
                        type="text"
                        value={articleSummary}
                        onChange={(e) => setArticleSummary(e.target.value)}
                        placeholder="Short 1-2 sentence overview..."
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Content (Markdown Supported)</label>
                      <textarea
                        rows={6}
                        value={articleContent}
                        onChange={(e) => setArticleContent(e.target.value)}
                        placeholder="# Heading 1&#10;Write theory content in Markdown..."
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm font-mono text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. LECTURE */}
                {manualContentType === "lecture" && (
                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Lecture Title</label>
                      <input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="e.g. Masterclass on Neural Networks"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Video URL (YouTube/Vimeo)</label>
                      <input
                        type="url"
                        value={lectureUrl}
                        onChange={(e) => setLectureUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={lectureDesc}
                        onChange={(e) => setLectureDesc(e.target.value)}
                        placeholder="Lecture contents description..."
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 4. QUESTION */}
                {manualContentType === "question" && (
                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Question Title</label>
                      <input
                        type="text"
                        value={qTitle}
                        onChange={(e) => setQTitle(e.target.value)}
                        placeholder="e.g. How does Dijkstra's Algorithm handle negative weights?"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Question Body</label>
                      <textarea
                        rows={4}
                        value={qBody}
                        onChange={(e) => setQBody(e.target.value)}
                        placeholder="Detail your question or problem statement..."
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={qTags}
                        onChange={(e) => setQTags(e.target.value)}
                        placeholder="Algorithms, Graphs, GATE"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 5. QUIZ */}
                {manualContentType === "quiz" && (
                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Quiz Title</label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="e.g. GATE AI 2024 Practice Quiz"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Quiz Description</label>
                      <input
                        type="text"
                        value={quizDesc}
                        onChange={(e) => setQuizDesc(e.target.value)}
                        placeholder="Brief overview of quiz topics..."
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-gray-950/40 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase text-gray-500">Quiz Questions</h4>
                      {quizQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
                          <input
                            type="text"
                            value={q.question_text}
                            onChange={(e) => {
                              const newQ = [...quizQuestions];
                              newQ[qIdx].question_text = e.target.value;
                              setQuizQuestions(newQ);
                            }}
                            placeholder={`Question ${qIdx + 1} text...`}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct_${qIdx}`}
                                  checked={opt.is_correct}
                                  onChange={() => {
                                    const newQ = [...quizQuestions];
                                    newQ[qIdx].options.forEach((o, idx) => o.is_correct = idx === optIdx);
                                    setQuizQuestions(newQ);
                                  }}
                                />
                                <input
                                  type="text"
                                  value={opt.option_text}
                                  onChange={(e) => {
                                    const newQ = [...quizQuestions];
                                    newQ[qIdx].options[optIdx].option_text = e.target.value;
                                    setQuizQuestions(newQ);
                                  }}
                                  placeholder={`Option ${optIdx + 1}`}
                                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1 text-xs text-gray-900 dark:text-white"
                                />
                              </div>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => {
                              const newQ = [...quizQuestions];
                              newQ[qIdx].explanation = e.target.value;
                              setQuizQuestions(newQ);
                            }}
                            placeholder="Explanation shown after quiz..."
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1 text-xs text-gray-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={manualSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {manualSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Saving Item...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" /> Save Content Item
                      </>
                    )}
                  </button>
                </div>
              </form>

              {manualResult && (
                <div
                  className={`p-4 rounded-2xl border text-sm ${
                    manualResult.success
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {manualResult.success ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-rose-500" />}
                    {manualResult.message}
                  </div>
                  {manualResult.details && manualResult.details.length > 0 && (
                    <ul className="mt-2 text-xs space-y-1 list-disc list-inside font-mono">
                      {manualResult.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: BATCH JSON */}
          {activeTab === "json" && (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-indigo-600" />
                  Batch JSON Paste
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Paste a JSON array of objects to ingest multiple items in a single click.
                </p>
              </div>

              {/* Sample Templates Bar */}
              <div className="flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-3 rounded-2xl">
                <span className="text-xs font-bold text-gray-500 mr-2">Load Template:</span>
                <button
                  type="button"
                  onClick={() => loadSampleJson("pyq")}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  PYQs Batch
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleJson("article")}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                >
                  Articles Batch
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleJson("quiz")}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                >
                  Quiz Batch
                </button>
              </div>

              <form onSubmit={handleBatchJsonSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Target Content Type
                  </label>
                  <select
                    value={jsonContentType}
                    onChange={(e) => setJsonContentType(e.target.value)}
                    className="w-full sm:w-64 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="pyq">PYQ / Practice Question</option>
                    <option value="article">Theory Article</option>
                    <option value="quiz">Practice Quiz</option>
                    <option value="lecture">Video Lecture</option>
                    <option value="question">Community Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Raw JSON Payload
                  </label>
                  <textarea
                    rows={12}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='[\n  {\n    "question_text": "Sample Question...",\n    "answer_text": "Sample Answer...",\n    "subject_name": "Algorithms"\n  }\n]'
                    className="w-full bg-gray-900 text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!jsonInput.trim() || jsonSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {jsonSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Ingesting JSON...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4" /> Ingest Batch JSON
                      </>
                    )}
                  </button>
                </div>
              </form>

              {jsonResult && (
                <div
                  className={`p-4 rounded-2xl border text-sm ${
                    jsonResult.success
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {jsonResult.success ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-rose-500" />}
                    {jsonResult.message}
                  </div>
                  {jsonResult.details && jsonResult.details.length > 0 && (
                    <ul className="mt-2 text-xs space-y-1 list-disc list-inside font-mono">
                      {jsonResult.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: STATS OVERVIEW */}
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-rose-600" />
                  Database Content Inventory
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Live snapshot of all indexed questions and educational resources stored in NeuralSpark.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "PYQs & Practice Questions",
                    count: stats?.pyqs ?? 0,
                    link: "/learning/pyqs",
                    desc: "Previous year exam questions & detailed explanations.",
                    color: "border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10"
                  },
                  {
                    title: "Community Q&A Forum",
                    count: stats?.questions ?? 0,
                    link: "/learning",
                    desc: "Student queries, discussions, and video solutions.",
                    color: "border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/10"
                  },
                  {
                    title: "Theory Articles & Notes",
                    count: stats?.articles ?? 0,
                    link: "/learning",
                    desc: "GeeksforGeeks-style Markdown guides & theory resources.",
                    color: "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10"
                  },
                  {
                    title: "Video Lectures",
                    count: stats?.lectures ?? 0,
                    link: "/learning/lectures",
                    desc: "Curated module video lectures & tutorial playlists.",
                    color: "border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10"
                  },
                  {
                    title: "Interactive Practice Quizzes",
                    count: stats?.quizzes ?? 0,
                    link: "/learning/quizzes",
                    desc: "Multiple choice diagnostic tests with immediate grading.",
                    color: "border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-950/10"
                  },
                  {
                    title: "Subject Categories",
                    count: stats?.categories ?? 0,
                    link: "/learning",
                    desc: "Topics like Data Structures, DBMS, Machine Learning, AI.",
                    color: "border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10"
                  },
                ].map((card, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl border ${card.color} space-y-3 flex flex-col justify-between`}>
                    <div>
                      <p className="text-3xl font-black text-gray-900 dark:text-white">{card.count}</p>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">{card.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{card.desc}</p>
                    </div>
                    <a
                      href={card.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2"
                    >
                      View Items <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
