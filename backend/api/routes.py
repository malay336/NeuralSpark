from ninja import NinjaAPI, File, UploadedFile, Form
from django.shortcuts import get_object_or_404
from typing import List, Optional
import os, json, csv, io
import PyPDF2
from core.models import Question, Answer, Comment, Tag, User, Category, Lecture, PYQ, Product, Service, Inquiry, Quiz, QuizQuestion, QuizOption, Article
from .schemas import (
    QuestionOutSchema, QuestionInSchema,
    AnswerOutSchema, AnswerInSchema,
    CommentOutSchema, CommentInSchema,
    CategorySchema, LectureSchema, PYQSchema, ProductSchema, ServiceSchema,
    AIGraderInSchema, AIGraderOutSchema,
    InquiryInSchema, InquiryOutSchema,
    QuizListSchema, QuizDetailSchema, QuizSubmissionIn, QuizSubmissionOut,
    AIAssistantInSchema, AIAssistantOutSchema,
    ArticleListSchema, ArticleDetailSchema,
    UploadResponseSchema, PYQUploadInSchema, ManualUploadInSchema, BatchJSONInSchema
)
from groq import Groq

# In a real app we'd use proper auth. 
# For testing the MVP, we will fetch the first user or create one.
def get_current_user():
    user, created = User.objects.get_or_create(username='testuser')
    return user

api = NinjaAPI()

@api.get("/hello/")
def hello(request):
    return {"message": "Hello from NeuralSpark"}

@api.get("/questions/", response=List[QuestionOutSchema])
def list_questions(request):
    """
    Retrieves all community questions from the database.
    Ordered descending by creation date (newest first).
    """
    return Question.objects.all().order_by('-created_at')

@api.post("/questions/", response=QuestionOutSchema)
def create_question(request, payload: QuestionInSchema):
    """
    Creates a new community Q&A question.
    Parses string tags from the payload and creates them if they do not exist.
    """
    user = get_current_user()
    question = Question.objects.create(
        author=user,
        title=payload.title,
        body=payload.body,
        video_url=payload.video_url
    )
    for tag_name in payload.tags:
        tag, _ = Tag.objects.get_or_create(name=tag_name)
        question.tags.add(tag)
    return question

@api.get("/questions/{q_id}/", response=QuestionOutSchema)
def get_question(request, q_id: int):
    """
    Fetches a single question by ID.
    Increments the view count by 1 every time this endpoint is hit.
    """
    q = get_object_or_404(Question, id=q_id)
    q.views += 1
    q.save()
    return q

@api.get("/questions/{q_id}/answers/", response=List[AnswerOutSchema])
def list_answers(request, q_id: int):
    # Only return approved answers
    return Answer.objects.filter(question_id=q_id, is_approved=True).order_by('-votes', 'created_at')

@api.post("/questions/{q_id}/answers/", response=AnswerOutSchema)
def create_answer(request, q_id: int, payload: AnswerInSchema):
    """
    Allows a user to submit a new answer to a specific question.
    """
    user = get_current_user()
    question = get_object_or_404(Question, id=q_id)
    answer = Answer.objects.create(
        author=user,
        question=question,
        body=payload.body
    )
    return answer

@api.post("/answers/{a_id}/upvote/", response=AnswerOutSchema)
def upvote_answer(request, a_id: int):
    """Increments the vote count on an answer by 1."""
    answer = get_object_or_404(Answer, id=a_id)
    answer.votes += 1
    answer.save()
    return answer

@api.post("/answers/{a_id}/downvote/", response=AnswerOutSchema)
def downvote_answer(request, a_id: int):
    """Decrements the vote count on an answer by 1."""
    answer = get_object_or_404(Answer, id=a_id)
    answer.votes -= 1
    answer.save()
    return answer

@api.post("/answers/{a_id}/comments/", response=CommentOutSchema)
def create_answer_comment(request, a_id: int, payload: CommentInSchema):
    user = get_current_user()
    answer = get_object_or_404(Answer, id=a_id)
    comment = Comment.objects.create(
        author=user,
        answer=answer,
        body=payload.body
    )
    return comment

@api.get("/categories/", response=List[CategorySchema])
def list_categories(request):
    return Category.objects.all()

@api.get("/lectures/", response=List[LectureSchema])
def list_lectures(request):
    """
    Fetches all video lectures, ordering them by their assigned Sequence 
    (Course Chapter) order.
    """
    return Lecture.objects.all().order_by('order', '-created_at')

@api.get("/pyqs/", response=List[PYQSchema])
def list_pyqs(request):
    return PYQ.objects.all().order_by('-year')

@api.get("/pyqs/{pyq_id}/", response=PYQSchema)
def get_pyq(request, pyq_id: int):
    """
    Fetches a single Previous Year Question by its ID.
    """
    return get_object_or_404(PYQ, id=pyq_id)

@api.post("/pyqs/", response=PYQSchema)
def create_pyq(request, payload: PYQUploadInSchema):
    """
    Creates a new PYQ / Practice question entry via API.
    """
    subject_name = payload.subject_name or "GENERAL APTITUDE"
    category, _ = Category.objects.get_or_create(name=subject_name)
    pyq = PYQ.objects.create(
        subject=category,
        year=payload.year,
        is_pyq=payload.is_pyq,
        question_text=payload.question_text,
        option_a=payload.option_a,
        option_b=payload.option_b,
        option_c=payload.option_c,
        option_d=payload.option_d,
        correct_option=(payload.correct_option or "").strip().upper() or None,
        answer_text=payload.answer_text,
        video_url=payload.video_url
    )
    return pyq

@api.put("/pyqs/{pyq_id}/", response=PYQSchema)
def update_pyq(request, pyq_id: int, payload: PYQUploadInSchema):
    """
    Updates an existing PYQ / Practice question entry by ID.
    """
    pyq = get_object_or_404(PYQ, id=pyq_id)
    if payload.subject_name:
        category, _ = Category.objects.get_or_create(name=payload.subject_name)
        pyq.subject = category
    if payload.year is not None: pyq.year = payload.year
    pyq.is_pyq = payload.is_pyq
    pyq.question_text = payload.question_text
    pyq.option_a = payload.option_a
    pyq.option_b = payload.option_b
    pyq.option_c = payload.option_c
    pyq.option_d = payload.option_d
    if payload.correct_option: pyq.correct_option = payload.correct_option.strip().upper()
    if payload.answer_text is not None: pyq.answer_text = payload.answer_text
    if payload.video_url is not None: pyq.video_url = payload.video_url
    pyq.save()
    return pyq

@api.delete("/pyqs/{pyq_id}/", response=dict)
def delete_pyq(request, pyq_id: int):
    """
    Deletes a PYQ / Practice question entry by ID.
    """
    pyq = get_object_or_404(PYQ, id=pyq_id)
    pyq.delete()
    return {"success": True, "message": f"Deleted PYQ ID {pyq_id}"}

@api.get("/products/", response=List[ProductSchema])
def list_products(request):
    return Product.objects.all().order_by('-created_at')

@api.get("/services/", response=List[ServiceSchema])
def list_services(request):
    """Lists available premium services (mentorship, consulting, etc.)."""
    return Service.objects.all().order_by('-created_at')

@api.post("/inquiries/", response=InquiryOutSchema)
def create_inquiry(request, payload: InquiryInSchema):
    """
    Receives contact form submissions. Links them to a specific Service 
    if a `service_id` is provided in the payload.
    """
    service = None
    if payload.service_id:
        service = get_object_or_404(Service, id=payload.service_id)
    inquiry = Inquiry.objects.create(
        name=payload.name,
        email=payload.email,
        service=service,
        message=payload.message
    )
    return inquiry

from ninja import Form, File
from ninja.files import UploadedFile
import base64
import PyPDF2
from typing import Optional

def _process_uploaded_file(file: UploadedFile, label: str):
    """
    Helper function to process multimodal file uploads for the AI Grader.
    - If it's a PDF, extracts the raw text via PyPDF2.
    - If it's an Image, reads the bytes, encodes to base64, and formats
      it as an image_url object for the Groq Vision model.
    """
    if not file:
        return None
    
    # If PDF, extract text and return a text message
    if file.name.endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(file.file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return {"type": "text", "text": f"\n--- {label} (Extracted from PDF) ---\n" + text}
        except Exception as e:
            return {"type": "text", "text": f"\n--- {label} (Error reading PDF) ---\n"}
            
    # If image, encode to base64 and return image_url message
    elif file.name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        try:
            base64_image = base64.b64encode(file.file.read()).decode('utf-8')
            return {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
            }
        except Exception:
            pass
    return None

@api.post("/products/ai-grader/", response=AIGraderOutSchema)
def ai_grader_endpoint(
    request, 
    question: str = Form(""),
    rubric: str = Form(""),
    student_answer: str = Form(""),
    question_file: UploadedFile = File(None),
    rubric_file: UploadedFile = File(None),
    student_answer_file: UploadedFile = File(None)
):
    """
    The main logic for the AI Assignment Grader.
    Constructs a dynamic multimodal payload from text inputs and uploaded files (PDFs/Images).
    Sends the compiled payload to Groq's `llama-3.2-11b-vision-preview` LLM model
    for automated grading and feedback generation.
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    system_prompt = """
    You are an expert Computer Science teaching assistant. Your job is to grade student submissions accurately and fairly.
    You must strictly follow the provided rubric.

    Output your evaluation EXACTLY in this format:
    Score: [Points]/[Total Possible Points]
    Feedback: [1-2 sentences explaining the score, highlighting any missing concepts or correct logic.]
    """

    user_content = []
    
    # Text prompts
    if question.strip():
        user_content.append({"type": "text", "text": f"Question:\n{question}\n"})
    if rubric.strip():
        user_content.append({"type": "text", "text": f"Rubric:\n{rubric}\n"})
    if student_answer.strip():
        user_content.append({"type": "text", "text": f"Student Answer:\n{student_answer}\n"})

    # Process files
    q_msg = _process_uploaded_file(question_file, "Question Attached File")
    if q_msg: user_content.append(q_msg)
        
    r_msg = _process_uploaded_file(rubric_file, "Rubric Attached File")
    if r_msg: user_content.append(r_msg)
        
    s_msg = _process_uploaded_file(student_answer_file, "Student Answer Attached File")
    if s_msg: user_content.append(s_msg)

    if not user_content:
        return {"evaluation": "No question, rubric, or answer provided."}

    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.1,
        )
        return {"evaluation": completion.choices[0].message.content}
    except Exception as e:
        return {"evaluation": f"Error during grading: {str(e)}"}

import json
from pathlib import Path

# Load model lazily to avoid heavy memory usage unless the endpoint is hit
# A global variable can hold the pipeline or model
custom_grader_pipeline = None

def get_custom_grader_pipeline():
    global custom_grader_pipeline
    if custom_grader_pipeline is None:
        try:
            from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
            import torch
            model_path = Path(__file__).resolve().parent.parent.parent / "ai_grader_model_customized"
            tokenizer = AutoTokenizer.from_pretrained(model_path)
            model = AutoModelForSequenceClassification.from_pretrained(model_path, num_labels=1)
            custom_grader_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer, device="cpu")
        except Exception as e:
            print(f"Failed to load custom model: {e}")
            return None
    return custom_grader_pipeline

@api.post("/products/ai-grader-customized/", response=AIGraderOutSchema)
def ai_grader_endpoint_customized(
    request, 
    question: str = Form(""),
    rubric: str = Form(""),
    student_answer: str = Form(""),
    question_file: UploadedFile = File(None),
    rubric_file: UploadedFile = File(None),
    student_answer_file: UploadedFile = File(None)
):
    """
    The main logic for the customized AI Assignment Grader using a locally fine-tuned model.
    """
    user_content_text = ""
    
    # Text prompts
    if question.strip():
        user_content_text += f"Question:\n{question}\n"
    if rubric.strip():
        user_content_text += f"Rubric:\n{rubric}\n"
    if student_answer.strip():
        user_content_text += f"Student Answer:\n{student_answer}\n"

    # Process files
    q_msg = _process_uploaded_file(question_file, "Question Attached File")
    if q_msg and q_msg.get("type") == "text": 
        user_content_text += q_msg["text"] + "\n"
        
    r_msg = _process_uploaded_file(rubric_file, "Rubric Attached File")
    if r_msg and r_msg.get("type") == "text": 
        user_content_text += r_msg["text"] + "\n"
        
    s_msg = _process_uploaded_file(student_answer_file, "Student Answer Attached File")
    if s_msg and s_msg.get("type") == "text": 
        user_content_text += s_msg["text"] + "\n"

    if not user_content_text.strip():
        return {"evaluation": "No valid text provided for grading."}

    grader = get_custom_grader_pipeline()
    if grader is None:
        return {"evaluation": "Custom model unavailable or failed to load. Please check server logs."}
    
    try:
        # Pass truncation=True and max_length=512 to ensure the model limits the max token size
        result = grader(user_content_text, truncation=True, max_length=512)
        score = result[0].get('score', result[0].get('label', 0.0))
        return {"evaluation": f"Score: {score:.2f}\nFeedback: (Graded by custom local model)"}
    except Exception as e:
        return {"evaluation": f"Error during grading with custom model: {str(e)}"}


@api.get("/quizzes/", response=List[QuizListSchema])
def list_quizzes(request, category_id: Optional[int] = None):
    """
    Lists all active practice quizzes, optionally filtered by category.
    """
    quizzes = Quiz.objects.all()
    if category_id:
        quizzes = quizzes.filter(category_id=category_id)
    
    # Annotate question counts
    for quiz in quizzes:
        quiz.question_count = quiz.questions.count()
    return quizzes


@api.get("/quizzes/{quiz_id}/", response=QuizDetailSchema)
def get_quiz(request, quiz_id: int):
    """
    Retrieves full details of a practice quiz, including questions and options.
    Options do not contain correct-answer flags to ensure no client-side cheating.
    """
    return get_object_or_404(Quiz, id=quiz_id)


@api.post("/quizzes/{quiz_id}/submit/", response=QuizSubmissionOut)
def submit_quiz(request, quiz_id: int, payload: QuizSubmissionIn):
    """
    Grades user answers securely on the server side.
    Computes total score and returns feedback, correct options, and detailed explanations.
    """
    quiz = get_object_or_404(Quiz, id=quiz_id)
    total_questions = quiz.questions.count()
    score = 0
    results = []

    # Map answers by question_id for quick lookup
    user_answers = {ans.question_id: ans.selected_option_id for ans in payload.answers}

    for question in quiz.questions.all():
        correct_option = question.options.filter(is_correct=True).first()
        correct_option_id = correct_option.id if correct_option else -1
        selected_option_id = user_answers.get(question.id, -1)
        is_correct = (selected_option_id == correct_option_id)
        
        if is_correct:
            score += 1

        results.append({
            "question_id": question.id,
            "correct_option_id": correct_option_id,
            "is_correct": is_correct,
            "explanation": question.explanation
        })

    return {
        "quiz_id": quiz.id,
        "score": score,
        "total_questions": total_questions,
        "results": results
    }


@api.get("/pyqs/{pyq_id}/answers/", response=List[AnswerOutSchema])
def list_pyq_answers(request, pyq_id: int):
    """
    Retrieves all approved community answers for a PYQ, sorted by votes.
    """
    return Answer.objects.filter(pyq_id=pyq_id, is_approved=True).order_by('-votes', 'created_at')


@api.post("/pyqs/{pyq_id}/answers/", response=AnswerOutSchema)
def create_pyq_answer(request, pyq_id: int, payload: AnswerInSchema):
    """
    Allows a user to submit an answer/explanation to a PYQ.
    Answers default to unapproved until reviewed by moderators.
    """
    user = get_current_user()
    pyq = get_object_or_404(PYQ, id=pyq_id)
    answer = Answer.objects.create(
        author=user,
        pyq=pyq,
        body=payload.body
    )
    return answer


@api.get("/pyqs/{pyq_id}/comments/", response=List[CommentOutSchema])
def list_pyq_comments(request, pyq_id: int):
    """
    Retrieves comments posted directly on a PYQ.
    """
    return Comment.objects.filter(pyq_id=pyq_id).order_by('created_at')


@api.post("/pyqs/{pyq_id}/comments/", response=CommentOutSchema)
def create_pyq_comment(request, pyq_id: int, payload: CommentInSchema):
    """
    Allows a user to post a comment directly on a PYQ.
    """
    user = get_current_user()
    pyq = get_object_or_404(PYQ, id=pyq_id)
    comment = Comment.objects.create(
        author=user,
        pyq=pyq,
        body=payload.body
    )
    return comment


@api.post("/ai-assistant/ask/", response=AIAssistantOutSchema)
def ask_ai_assistant(request, payload: AIAssistantInSchema):
    """
    Queries the Groq-hosted Llama-4 model to provide immediate tutoring responses to student queries.
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    system_prompt = (
        "You are an expert Computer Science professor and GATE exam tutor. "
        "Provide detailed, structured, clear, and mathematically precise explanations. "
        "Include examples, clean markdown code blocks, or simple markdown tables where appropriate. "
        "Keep the tone encouraging, academic, and highly educational."
    )
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.question}
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.3,
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"response": f"AI Assistant Error: {str(e)}. Please check backend configuration."}


@api.get("/articles/", response=List[ArticleListSchema])
def list_articles(request, category_id: Optional[int] = None):
    """
    Lists all theory articles, optionally filtered by subject Category.
    """
    articles = Article.objects.all()
    if category_id:
        articles = articles.filter(subject_id=category_id)
    return articles.order_by('-created_at')


@api.get("/articles/{article_id}/", response=ArticleDetailSchema)
def get_article(request, article_id: int):
    """
    Retrieves full details of a specific theory article.
    """
    return get_object_or_404(Article, id=article_id)


# ==============================================================================
# CONTENT & QUESTION UPLOAD / INGESTION ENDPOINTS
# ==============================================================================

def helper_get_category(name: Optional[str] = "General CS & AI"):
    cat_name = name.strip() if name and name.strip() else "General CS & AI"
    cat, _ = Category.objects.get_or_create(name=cat_name, defaults={"description": f"Category for {cat_name}"})
    return cat

def helper_ingest_item(content_type: str, item: dict, default_subject: Optional[str] = None):
    subject_name = item.get("subject_name") or item.get("category") or item.get("subject") or default_subject or "General CS & AI"
    category = helper_get_category(subject_name)

    if content_type == "pyq":
        year = item.get("year")
        try:
            year = int(year) if year is not None else None
        except ValueError:
            year = None
        
        pyq = PYQ.objects.create(
            subject=category,
            year=year,
            is_pyq=bool(item.get("is_pyq", True)),
            question_text=item.get("question_text", "").strip(),
            option_a=item.get("option_a") or None,
            option_b=item.get("option_b") or None,
            option_c=item.get("option_c") or None,
            option_d=item.get("option_d") or None,
            correct_option=(item.get("correct_option") or "").strip().upper() or None,
            answer_text=item.get("answer_text", "").strip(),
            video_url=item.get("video_url") or None
        )
        return f"Created PYQ ID {pyq.id}"

    elif content_type == "question":
        user = get_current_user()
        q = Question.objects.create(
            author=user,
            category=category,
            title=item.get("title", "Community Question").strip(),
            body=item.get("body", item.get("question_text", "")).strip(),
            video_url=item.get("video_url") or None
        )
        tags = item.get("tags", [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        for tag_name in tags:
            tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
            q.tags.add(tag_obj)
        return f"Created Question ID {q.id}"

    elif content_type == "article":
        art = Article.objects.create(
            subject=category,
            title=item.get("title", "Theory Article").strip(),
            summary=item.get("summary", item.get("content", "")[:150]).strip(),
            content=item.get("content", "").strip()
        )
        return f"Created Article ID {art.id}"

    elif content_type == "lecture":
        order_val = item.get("order", 0)
        try:
            order_val = int(order_val)
        except ValueError:
            order_val = 0
        lec = Lecture.objects.create(
            category=category,
            title=item.get("title", "Video Lecture").strip(),
            description=item.get("description", "").strip(),
            video_url=item.get("video_url", "https://youtube.com").strip(),
            order=order_val
        )
        return f"Created Lecture ID {lec.id}"

    elif content_type == "quiz":
        quiz = Quiz.objects.create(
            category=category,
            title=item.get("title", "Practice Quiz").strip(),
            description=item.get("description", "").strip()
        )
        q_list = item.get("questions", [])
        for q_data in q_list:
            qq = QuizQuestion.objects.create(
                quiz=quiz,
                question_text=q_data.get("question_text", "").strip(),
                explanation=q_data.get("explanation", "").strip()
            )
            opts = q_data.get("options", [])
            for opt_data in opts:
                if isinstance(opt_data, dict):
                    QuizOption.objects.create(
                        question=qq,
                        option_text=opt_data.get("option_text", "").strip(),
                        is_correct=bool(opt_data.get("is_correct", False))
                    )
                elif isinstance(opt_data, str):
                    QuizOption.objects.create(
                        question=qq,
                        option_text=opt_data.strip(),
                        is_correct=False
                    )
        return f"Created Quiz ID {quiz.id} with {len(q_list)} questions"

    else:
        raise ValueError(f"Unsupported content_type: {content_type}")


@api.get("/upload/stats/", response=dict)
def get_upload_stats(request):
    """
    Returns current counts for all content models in NeuralSpark.
    """
    return {
        "pyqs": PYQ.objects.count(),
        "questions": Question.objects.count(),
        "articles": Article.objects.count(),
        "lectures": Lecture.objects.count(),
        "quizzes": Quiz.objects.count(),
        "categories": Category.objects.count()
    }


@api.post("/upload/manual/", response=UploadResponseSchema)
def upload_manual_content(request, payload: ManualUploadInSchema):
    """
    Endpoint for uploading a single structured item manually.
    """
    ctype = payload.content_type.lower()
    details = []
    try:
        if ctype == "pyq" and payload.pyq:
            msg = helper_ingest_item("pyq", payload.pyq.dict())
        elif ctype == "question" and payload.question:
            msg = helper_ingest_item("question", payload.question.dict())
        elif ctype == "article" and payload.article:
            msg = helper_ingest_item("article", payload.article.dict())
        elif ctype == "lecture" and payload.lecture:
            msg = helper_ingest_item("lecture", payload.lecture.dict())
        elif ctype == "quiz" and payload.quiz:
            msg = helper_ingest_item("quiz", payload.quiz.dict())
        else:
            return UploadResponseSchema(
                success=False,
                message=f"Missing payload data for content_type '{ctype}'",
                items_created=0
            )

        return UploadResponseSchema(
            success=True,
            message=f"Successfully created {ctype.upper()} content.",
            items_created=1,
            details=[msg]
        )
    except Exception as e:
        return UploadResponseSchema(
            success=False,
            message=f"Error ingesting content: {str(e)}",
            items_created=0
        )


@api.post("/upload/batch-json/", response=UploadResponseSchema)
def upload_batch_json(request, payload: BatchJSONInSchema):
    """
    Endpoint for uploading a raw JSON string array of items.
    """
    ctype = payload.content_type.lower()
    try:
        data = json.loads(payload.json_data)
        if isinstance(data, dict):
            data = [data]
        elif not isinstance(data, list):
            return UploadResponseSchema(success=False, message="JSON must be an object or array of objects")

        created_count = 0
        details = []
        for item in data:
            if isinstance(item, dict):
                msg = helper_ingest_item(ctype, item)
                details.append(msg)
                created_count += 1

        return UploadResponseSchema(
            success=True,
            message=f"Successfully ingested {created_count} {ctype.upper()} item(s).",
            items_created=created_count,
            details=details
        )
    except Exception as e:
        return UploadResponseSchema(
            success=False,
            message=f"JSON ingestion failed: {str(e)}",
            items_created=0
        )


@api.post("/upload/file/", response=UploadResponseSchema)
def upload_file_content(
    request,
    file: UploadedFile = File(...),
    content_type: str = Form(...),
    subject_name: Optional[str] = Form(None)
):
    """
    Multipart file upload endpoint supporting .json, .csv, .md, .txt, and .pdf files.
    """
    ctype = content_type.lower().strip()
    filename = file.name.lower()
    created_count = 0
    details = []

    try:
        # 1. JSON FILE
        if filename.endswith(".json"):
            file_text = file.read().decode("utf-8")
            raw = json.loads(file_text)
            items = raw if isinstance(raw, list) else [raw]
            for item in items:
                if isinstance(item, dict):
                    msg = helper_ingest_item(ctype, item, default_subject=subject_name)
                    details.append(msg)
                    created_count += 1

        # 2. CSV FILE
        elif filename.endswith(".csv"):
            file_text = file.read().decode("utf-8")
            reader = csv.DictReader(io.StringIO(file_text))
            for row in reader:
                msg = helper_ingest_item(ctype, dict(row), default_subject=subject_name)
                details.append(msg)
                created_count += 1

        # 3. MARKDOWN / TXT FILE
        elif filename.endswith(".md") or filename.endswith(".txt"):
            file_text = file.read().decode("utf-8")
            lines = file_text.strip().split("\n")
            title = filename.replace(".md", "").replace(".txt", "").replace("_", " ").title()
            
            # Extract first heading if present
            if lines and lines[0].startswith("#"):
                title = lines[0].lstrip("#").strip()
                content_body = "\n".join(lines[1:]).strip()
            else:
                content_body = file_text

            if ctype == "article":
                item_dict = {
                    "title": title,
                    "summary": content_body[:180].replace("\n", " ") + "...",
                    "content": content_body,
                    "subject_name": subject_name or "General CS & AI"
                }
            elif ctype == "pyq":
                item_dict = {
                    "question_text": content_body,
                    "answer_text": f"Extracted from {filename}",
                    "subject_name": subject_name or "General CS & AI"
                }
            else:
                item_dict = {
                    "title": title,
                    "body": content_body,
                    "question_text": content_body,
                    "content": content_body,
                    "subject_name": subject_name or "General CS & AI"
                }

            msg = helper_ingest_item(ctype, item_dict, default_subject=subject_name)
            details.append(msg)
            created_count += 1

        # 4. PDF DOCUMENT
        elif filename.endswith(".pdf"):
            pdf_bytes = file.read()
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
            full_text = ""
            for i, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text() or ""
                if page_text.strip():
                    full_text += f"\n--- Page {i+1} ---\n" + page_text

            if not full_text.strip():
                return UploadResponseSchema(
                    success=False,
                    message="Could not extract readable text from the provided PDF document.",
                    items_created=0
                )

            title = filename.replace(".pdf", "").replace("_", " ").title()
            if ctype == "article":
                item_dict = {
                    "title": title,
                    "summary": f"Extracted theory document ({len(pdf_reader.pages)} pages).",
                    "content": full_text.strip(),
                    "subject_name": subject_name or "General CS & AI"
                }
            elif ctype == "pyq":
                item_dict = {
                    "question_text": full_text.strip(),
                    "answer_text": f"Extracted from PDF {filename}",
                    "subject_name": subject_name or "General CS & AI"
                }
            else:
                item_dict = {
                    "title": title,
                    "body": full_text.strip(),
                    "question_text": full_text.strip(),
                    "content": full_text.strip(),
                    "subject_name": subject_name or "General CS & AI"
                }

            msg = helper_ingest_item(ctype, item_dict, default_subject=subject_name)
            details.append(msg)
            created_count += 1

        else:
            return UploadResponseSchema(
                success=False,
                message="Unsupported file format. Please upload .json, .csv, .md, .txt, or .pdf files.",
                items_created=0
            )

        return UploadResponseSchema(
            success=True,
            message=f"Successfully ingested {created_count} item(s) from '{file.name}'.",
            items_created=created_count,
            details=details
        )
    except Exception as e:
        return UploadResponseSchema(
            success=False,
            message=f"File upload error: {str(e)}",
            items_created=0
        )





