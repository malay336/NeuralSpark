import os
import sys
import json
import urllib.request
import urllib.error

def test_api_endpoint(name, url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    print(f"\n--- Testing {name} [{method} {url}] ---")
    try:
        req_data = None
        if data is not None:
            if isinstance(data, dict):
                req_data = json.dumps(data).encode("utf-8")
                headers["Content-Type"] = "application/json"
            else:
                req_data = data
        
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=15) as res:
            body = res.read().decode("utf-8")
            print(f"Status: {res.status} OK")
            try:
                parsed = json.loads(body)
                if isinstance(parsed, list):
                    print(f"Response: List with {len(parsed)} items. First item snippet: {str(parsed[0])[:120] if parsed else 'empty'}")
                elif isinstance(parsed, dict):
                    print(f"Response: Dict with keys {list(parsed.keys())}. Snippet: {str(parsed)[:200]}")
                return True, parsed
            except:
                print(f"Response (raw text): {body[:200]}")
                return True, body
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"FAILED with HTTP {e.code}: {err_body[:300]}")
        return False, err_body
    except Exception as e:
        print(f"FAILED with error: {e}")
        return False, str(e)

def run_all_tests():
    print("=================================================================")
    print("       NEURALSPARK COMPLETE SYSTEM HEALTH & GRADER DIAGNOSTIC   ")
    print("=================================================================")
    
    base_url = "http://127.0.0.1:8000/api"
    results = {}

    # 1. Categories
    success, data = test_api_endpoint("Categories", f"{base_url}/categories/")
    results["Categories API"] = success

    # 2. Practice Questions / PYQs
    success, data = test_api_endpoint("PYQs (All)", f"{base_url}/pyqs/")
    results["PYQs All"] = success
    
    success, data = test_api_endpoint("PYQs Filtered (Linear Algebra)", f"{base_url}/pyqs/?subject=Linear%20Algebra")
    results["PYQs Filtered"] = success

    # 3. Theory Articles
    success, data = test_api_endpoint("Theory Articles List", f"{base_url}/articles/")
    results["Articles List"] = success
    if success and data:
        art_id = data[0].get("id", 1)
        success_detail, _ = test_api_endpoint(f"Theory Article Detail (ID={art_id})", f"{base_url}/articles/{art_id}/")
        results["Article Detail"] = success_detail

    # 4. Quizzes
    success, data = test_api_endpoint("Quizzes List", f"{base_url}/quizzes/")
    results["Quizzes List"] = success
    if success and data:
        quiz_id = data[0].get("id", 1)
        success_detail, q_detail = test_api_endpoint(f"Quiz Detail (ID={quiz_id})", f"{base_url}/quizzes/{quiz_id}/")
        results["Quiz Detail"] = success_detail
        
        # Test Quiz Submission
        if success_detail and isinstance(q_detail, dict) and "questions" in q_detail:
            answers = {}
            for q in q_detail["questions"]:
                if q.get("options"):
                    answers[str(q["id"])] = q["options"][0]["id"]
            
            sub_payload = {"answers": answers}
            success_sub, sub_res = test_api_endpoint(f"Quiz Submission (ID={quiz_id})", f"{base_url}/quizzes/{quiz_id}/submit/", method="POST", data=sub_payload)
            results["Quiz Submission"] = success_sub

    # 5. Video Lectures
    success, data = test_api_endpoint("Video Lectures", f"{base_url}/lectures/")
    results["Lectures API"] = success

    # 6. Inquiries
    inquiry_payload = {
        "name": "Test User",
        "email": "test@neuralspark.edu",
        "message": "Automated system diagnostic health check message."
    }
    success, data = test_api_endpoint("Support Inquiry Submission", f"{base_url}/inquiries/", method="POST", data=inquiry_payload)
    results["Inquiries Submission"] = success

    # 7. Testing AI Grader Endpoints
    print("\n=================================================================")
    print("             TESTING AI GRADER ENGINES & ACCURACY               ")
    print("=================================================================")

    # Test Case 1: High Quality Answer
    good_submission = {
        "question": "What is the time complexity of Binary Search and why?",
        "rubric": "Max 5 marks. 2 marks for stating O(log n). 2 marks for explaining that the search space is halved at each comparison. 1 mark for mentioning the array must be sorted.",
        "student_answer": "The time complexity of Binary Search is O(log n). This is because at each comparison step, the algorithm divides the search range into two equal halves by comparing the target with the middle element. Since the search space reduces as n, n/2, n/4, ..., 1, the number of steps required to reduce the space to 1 is log2(n). Note that Binary Search requires the array to be sorted beforehand."
    }
    
    # Test Case 2: Incomplete / Partially Incorrect Answer
    poor_submission = {
        "question": "What is the time complexity of Binary Search and why?",
        "rubric": "Max 5 marks. 2 marks for stating O(log n). 2 marks for explaining that the search space is halved at each comparison. 1 mark for mentioning the array must be sorted.",
        "student_answer": "Binary Search time complexity is O(n) because it checks each element in the list one by one until the target item is found."
    }

    # Let's test the upload/manual endpoint or grade endpoint in Django routes
    print("\nChecking available grading routes in backend...")
    
    return results

if __name__ == "__main__":
    run_all_tests()
