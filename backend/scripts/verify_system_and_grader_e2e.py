import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path
from dotenv import load_dotenv

# Load env variables
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def test_http(name, url, method="GET", data=None, headers=None, is_form=False):
    if headers is None:
        headers = {}
    print(f"\n[TEST] {name} -> {method} {url}")
    try:
        req_data = None
        if data is not None:
            if is_form:
                req_data = urllib.parse.urlencode(data).encode("utf-8")
                headers["Content-Type"] = "application/x-www-form-urlencoded"
            elif isinstance(data, dict):
                req_data = json.dumps(data).encode("utf-8")
                headers["Content-Type"] = "application/json"
            else:
                req_data = data
        
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=30) as res:
            raw = res.read().decode("utf-8")
            print(f" -> HTTP {res.status} OK")
            try:
                parsed = json.loads(raw)
                return True, parsed
            except:
                return True, raw
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        print(f" -> FAILED HTTP {e.code}: {err[:250]}")
        return False, err
    except Exception as e:
        print(f" -> FAILED Error: {e}")
        return False, str(e)

def run_e2e_verification():
    print("=" * 70)
    print("   NEURALSPARK COMPLETE SYSTEM & GRADER VERIFICATION SUITE   ")
    print("=" * 70)
    
    base = "http://127.0.0.1:8000/api"
    report = {}

    # 1. Categories
    ok, cat_data = test_http("List Subject Categories", f"{base}/categories/")
    report["Categories API"] = "PASS" if ok and len(cat_data) > 0 else "FAIL"

    # 2. Practice Questions / PYQs
    ok, pyq_data = test_http("List PYQs", f"{base}/pyqs/")
    report["PYQs API"] = "PASS" if ok and len(pyq_data) > 0 else "FAIL"

    # 3. Theory Articles
    ok, art_data = test_http("List Theory Articles", f"{base}/articles/")
    report["Articles API"] = "PASS" if ok and len(art_data) > 0 else "FAIL"

    # 4. Quizzes & Quiz Submission
    ok, quiz_data = test_http("List Quizzes", f"{base}/quizzes/")
    report["Quizzes List API"] = "PASS" if ok and len(quiz_data) > 0 else "FAIL"
    if ok and len(quiz_data) > 0:
        qid = quiz_data[0]["id"]
        ok_q, q_det = test_http(f"Fetch Quiz #{qid}", f"{base}/quizzes/{qid}/")
        if ok_q and "questions" in q_det:
            ans_payload = {"answers": [{"question_id": q["id"], "selected_option_id": q["options"][0]["id"]} for q in q_det["questions"] if q.get("options")]}
            ok_sub, sub_res = test_http(f"Submit Quiz #{qid}", f"{base}/quizzes/{qid}/submit/", method="POST", data=ans_payload)
            report["Quiz Grading Engine"] = "PASS" if ok_sub and "score" in sub_res else "FAIL"
            print(f"    Quiz Grading Result: Score = {sub_res.get('score')}/{sub_res.get('total_questions')}")

    # 5. Video Lectures
    ok, lec_data = test_http("List Lectures", f"{base}/lectures/")
    report["Lectures API"] = "PASS" if ok and len(lec_data) > 0 else "FAIL"

    # 6. Community Forum Post & Retrieve
    new_q = {
        "title": "What is the amortized time complexity of dynamic array resizing?",
        "body": "When a dynamic array doubles its capacity upon reaching maximum size, why is the insertion amortized O(1)?",
        "tags": ["DSA", "Complexity", "Arrays"]
    }
    ok_q_create, q_res = test_http("Create Community Question", f"{base}/questions/", method="POST", data=new_q)
    report["Community Forum Post"] = "PASS" if ok_q_create else "FAIL"

    # 7. AI Assistant / GATE CS Tutor
    tutor_payload = {
        "question": "Explain the time complexity of QuickSort in the average case and worst case."
    }
    ok_tutor, tutor_res = test_http("AI Assistant / GATE Tutor", f"{base}/ai-assistant/ask/", method="POST", data=tutor_payload)
    report["AI Assistant Tutor"] = "PASS" if ok_tutor and "response" in tutor_res else "FAIL"
    if ok_tutor and isinstance(tutor_res, dict):
        print(f"    Tutor Explanation Snippet: {tutor_res.get('response', '')[:200]}...")

    # 8. AI Grader - Mode A (Cloud Multimodal / Rubric Grader)
    print("\n" + "=" * 70)
    print("    TESTING AI GRADER MODE A (CLOUD RUBRIC-BASED GRADING)   ")
    print("=" * 70)

    # Test 8A: Good Student Answer
    good_grade_payload = {
        "question": "State the Master Theorem formula and solve T(n) = 2T(n/2) + Theta(n).",
        "rubric": "Max 5 Marks: 2 marks for stating the Master Theorem form T(n) = aT(n/b) + f(n); 2 marks for computing log_b(a) = log_2(2) = 1; 1 mark for correct conclusion T(n) = Theta(n log n) by Case 2.",
        "student_answer": "Master Theorem is of the form T(n) = aT(n/b) + f(n) where a >= 1, b > 1. Here a = 2, b = 2, and f(n) = Theta(n). We calculate n^(log_b a) = n^(log_2 2) = n^1 = n. Since f(n) = Theta(n^(log_b a)), this falls strictly under Case 2 of Master Theorem. Therefore, T(n) = Theta(n * log n)."
    }
    ok_g1, res_g1 = test_http("Mode A: Excellent Student Submission", f"{base}/products/ai-grader/", method="POST", data=good_grade_payload, is_form=True)
    report["Mode A (Good Answer Grading)"] = "PASS" if ok_g1 and "evaluation" in res_g1 else "FAIL"
    if ok_g1 and isinstance(res_g1, dict):
        print(f"\n--- AI Grader Output (Good Answer) ---\n{res_g1.get('evaluation')}\n")

    # Test 8B: Flawed Student Answer
    flawed_grade_payload = {
        "question": "State the Master Theorem formula and solve T(n) = 2T(n/2) + Theta(n).",
        "rubric": "Max 5 Marks: 2 marks for stating Master Theorem form; 2 marks for log_b(a) computation; 1 mark for Theta(n log n) conclusion.",
        "student_answer": "T(n) = 2T(n/2) + n means time complexity is O(n^2) because it multiplies by 2."
    }
    ok_g2, res_g2 = test_http("Mode A: Flawed Student Submission", f"{base}/products/ai-grader/", method="POST", data=flawed_grade_payload, is_form=True)
    report["Mode A (Flawed Answer Grading)"] = "PASS" if ok_g2 and "evaluation" in res_g2 else "FAIL"
    if ok_g2 and isinstance(res_g2, dict):
        print(f"\n--- AI Grader Output (Flawed Answer) ---\n{res_g2.get('evaluation')}\n")

    # 9. AI Grader - Mode B (Local Customized Transformer Model)
    print("\n" + "=" * 70)
    print("    TESTING AI GRADER MODE B (LOCAL OFFLINE TRANSFORMER)    ")
    print("=" * 70)
    
    local_payload = {
        "question": "What is the time complexity of binary search?",
        "rubric": "Max 5. 2 marks for O(log n), 2 marks for halving search space, 1 mark for sorted precondition.",
        "student_answer": "Binary search is O(log n) because at each step the remaining search space is cut in half. Requires sorted input."
    }
    ok_local, res_local = test_http("Mode B: Local Offline Model", f"{base}/products/ai-grader-customized/", method="POST", data=local_payload, is_form=True)
    report["Mode B (Local Offline Grader)"] = "PASS" if ok_local and "evaluation" in res_local else "FAIL"
    if ok_local and isinstance(res_local, dict):
        print(f"\n--- Local Custom Grader Output ---\n{res_local.get('evaluation')}\n")

    # Summary Report
    print("\n" + "=" * 70)
    print("                FINAL SYSTEM VERIFICATION SUMMARY                 ")
    print("=" * 70)
    all_passed = True
    for test_name, status in report.items():
        print(f"  [{status}] {test_name}")
        if status != "PASS":
            all_passed = False
            
    print("=" * 70)
    print(f"OVERALL RESULT: {'ALL SYSTEMS FULLY OPERATIONAL' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 70)

if __name__ == "__main__":
    run_e2e_verification()
