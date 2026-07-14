import os
import sys
import django
from django.test import Client

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import Quiz, QuizQuestion, QuizOption

def test_api():
    print("Testing Quiz API endpoints...")
    client = Client()

    # 1. Test GET /api/quizzes/
    response = client.get('/api/quizzes/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"GET /api/quizzes/ returned {len(data)} quizzes.")
    for q in data:
        print(f" - Quiz '{q['title']}' has {q['question_count']} questions.")
        assert 'category' in q
        assert 'question_count' in q
        # Make sure is_correct is not leaked
        assert 'is_correct' not in q

    # Fetch a quiz id to test details and submission
    first_quiz = Quiz.objects.first()
    if not first_quiz:
        print("No quizzes found in DB. Seeding may have failed.")
        return

    # 2. Test GET /api/quizzes/{id}/
    response = client.get(f'/api/quizzes/{first_quiz.id}/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    detail = response.json()
    print(f"GET /api/quizzes/{first_quiz.id}/ details loaded successfully.")
    assert len(detail['questions']) > 0
    
    # Check that option items don't leak correctness
    for question in detail['questions']:
        for option in question['options']:
            assert 'is_correct' not in option, "Option schema leaks is_correct!"

    # 3. Test POST /api/quizzes/{id}/submit/
    # Prepare correct answers
    correct_payload = {
        "answers": []
    }
    for question in first_quiz.questions.all():
        correct_option = question.options.filter(is_correct=True).first()
        correct_payload["answers"].append({
            "question_id": question.id,
            "selected_option_id": correct_option.id
        })

    response = client.post(
        f'/api/quizzes/{first_quiz.id}/submit/',
        data=correct_payload,
        content_type='application/json'
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    res_data = response.json()
    print(f"POST /api/quizzes/{first_quiz.id}/submit/ (Correct Answers) returned score: {res_data['score']}/{res_data['total_questions']}")
    assert res_data['score'] == res_data['total_questions'], f"Expected perfect score, got {res_data['score']}"

    # Prepare incorrect answers
    incorrect_payload = {
        "answers": []
    }
    for question in first_quiz.questions.all():
        incorrect_option = question.options.filter(is_correct=False).first()
        incorrect_payload["answers"].append({
            "question_id": question.id,
            "selected_option_id": incorrect_option.id
        })

    response = client.post(
        f'/api/quizzes/{first_quiz.id}/submit/',
        data=incorrect_payload,
        content_type='application/json'
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    res_data_inc = response.json()
    print(f"POST /api/quizzes/{first_quiz.id}/submit/ (Incorrect Answers) returned score: {res_data_inc['score']}/{res_data_inc['total_questions']}")
    assert res_data_inc['score'] == 0, f"Expected 0 score, got {res_data_inc['score']}"
    
    # Check details of results
    for res in res_data_inc['results']:
        assert res['is_correct'] is False
        assert res['explanation'] is not None
        print(f" - Question {res['question_id']} result verified. Explanation: {res['explanation']}")

    print("All Quiz API endpoints verified successfully!")

if __name__ == '__main__':
    test_api()
