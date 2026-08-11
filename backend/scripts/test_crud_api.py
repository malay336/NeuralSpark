import httpx

BASE_URL = "http://127.0.0.1:8000/api"

def test_crud():
    print("1. Testing POST /api/pyqs/ (Create Question)...")
    post_payload = {
        "question_text": "Temporary Test Question: What is 2 + 2?",
        "option_a": "3",
        "option_b": "4",
        "option_c": "5",
        "option_d": "6",
        "correct_option": "B",
        "answer_text": "2 + 2 = 4.",
        "subject_name": "GENERAL APTITUDE",
        "year": 2025,
        "is_pyq": False
    }
    res = httpx.post(f"{BASE_URL}/pyqs/", json=post_payload)
    print("Status:", res.status_code)
    data = res.json()
    print("Response:", data)
    created_id = data.get("id")
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}"

    print(f"\n2. Testing PUT /api/pyqs/{created_id}/ (Update Question)...")
    put_payload = {
        "question_text": "Updated Test Question: What is 2 + 2?",
        "option_a": "3",
        "option_b": "4 (Correct)",
        "option_c": "5",
        "option_d": "6",
        "correct_option": "B",
        "answer_text": "Updated explanation: 2 + 2 equals 4.",
        "subject_name": "GENERAL APTITUDE",
        "year": 2025,
        "is_pyq": False
    }
    res_put = httpx.put(f"{BASE_URL}/pyqs/{created_id}/", json=put_payload)
    print("Status:", res_put.status_code)
    print("Response:", res_put.json())
    assert res_put.status_code == 200, f"Expected 200 OK, got {res_put.status_code}"

    print(f"\n3. Testing DELETE /api/pyqs/{created_id}/ (Delete Question)...")
    res_del = httpx.delete(f"{BASE_URL}/pyqs/{created_id}/")
    print("Status:", res_del.status_code)
    print("Response:", res_del.json())
    assert res_del.status_code == 200, f"Expected 200 OK, got {res_del.status_code}"

    print("\nALL REST API CRUD TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    test_crud()
