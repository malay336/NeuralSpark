import httpx
import json
import os

BASE_URL = "http://127.0.0.1:8000/api"

def test_upload_stats():
    print("Testing GET /api/upload/stats/ ...")
    r = httpx.get(f"{BASE_URL}/upload/stats/")
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.status_code == 200, "Stats failed"

def test_manual_upload():
    print("\nTesting POST /api/upload/manual/ (PYQ) ...")
    payload = {
        "content_type": "pyq",
        "pyq": {
            "question_text": "What is the worst-case time complexity of QuickSort?",
            "answer_text": "O(n^2) when pivot selection is poor.",
            "year": 2024,
            "is_pyq": True,
            "subject_name": "Algorithms & Data Structures"
        }
    }
    r = httpx.post(f"{BASE_URL}/upload/manual/", json=payload)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.status_code == 200 and r.json().get("success"), "Manual PYQ upload failed"

def test_batch_json():
    print("\nTesting POST /api/upload/batch-json/ (Articles) ...")
    articles = [
        {
            "title": "Introduction to Convolutional Neural Networks",
            "summary": "Overview of CNN architectures, kernels, pooling, and feature maps.",
            "content": "# CNN Architecture\nCNNs use convolution operations to extract spatial hierarchies.",
            "subject_name": "Machine Learning & AI"
        },
        {
            "title": "Understanding Relational Algebra in DBMS",
            "summary": "Basic and extended relational operators in relational databases.",
            "content": "# Relational Algebra\nKey operators include Select, Project, Join, and Division.",
            "subject_name": "Database Systems"
        }
    ]
    payload = {
        "content_type": "article",
        "json_data": json.dumps(articles)
    }
    r = httpx.post(f"{BASE_URL}/upload/batch-json/", json=payload)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.status_code == 200 and r.json().get("success"), "Batch JSON upload failed"

def test_file_upload_json(tmp_path="temp_test.json"):
    print("\nTesting POST /api/upload/file/ (JSON File) ...")
    data = [
        {
            "title": "GATE 2024 AI Sample Quiz",
            "description": "Practice quiz on foundational ML concepts",
            "subject_name": "Machine Learning & AI",
            "questions": [
                {
                    "question_text": "Which activation function suffers from the vanishing gradient problem in deep networks?",
                    "explanation": "Sigmoid compresses inputs into (0,1), leading to tiny gradients in deep layers.",
                    "options": [
                        {"option_text": "ReLU", "is_correct": False},
                        {"option_text": "Sigmoid", "is_correct": True},
                        {"option_text": "LeakyReLU", "is_correct": False},
                        {"option_text": "GELU", "is_correct": False}
                    ]
                }
            ]
        }
    ]
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f)

    with open(tmp_path, "rb") as f:
        files = {"file": (tmp_path, f, "application/json")}
        data_fields = {"content_type": "quiz", "subject_name": "Machine Learning & AI"}
        r = httpx.post(f"{BASE_URL}/upload/file/", files=files, data=data_fields)

    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
    assert r.status_code == 200 and r.json().get("success"), "File upload JSON failed"

if __name__ == "__main__":
    test_upload_stats()
    test_manual_upload()
    test_batch_json()
    test_file_upload_json()
    print("\nALL UPLOAD BACKEND TESTS PASSED SUCCESSFULLY!")
