import os
import sys
import django
from django.test import Client

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import PYQ, Answer, Comment

def test_pyq_forum():
    print("Testing PYQ Discussion Forum endpoints...")
    client = Client()

    # Find a PYQ to test
    first_pyq = PYQ.objects.first()
    if not first_pyq:
        print("No PYQ questions found in database. Make sure categories and seed data are populated.")
        return

    # 1. Test POST /api/pyqs/{pyq_id}/answers/ (Submit community answer)
    answer_payload = {
        "body": "This is a detailed alternative explanation for the computer science question."
    }
    response = client.post(
        f'/api/pyqs/{first_pyq.id}/answers/',
        data=answer_payload,
        content_type='application/json'
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    ans_data = response.json()
    print(f"POST /api/pyqs/{first_pyq.id}/answers/ (Create Answer) succeeded. ID: {ans_data['id']}")
    assert ans_data['body'] == answer_payload['body']
    assert ans_data['is_approved'] is False, "Answer should default to unapproved"

    # Make the answer approved so it is visible in lists
    db_answer = Answer.objects.get(id=ans_data['id'])
    db_answer.is_approved = True
    db_answer.save()

    # 2. Test GET /api/pyqs/{pyq_id}/answers/ (List answers)
    response = client.get(f'/api/pyqs/{first_pyq.id}/answers/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    answers_list = response.json()
    print(f"GET /api/pyqs/{first_pyq.id}/answers/ returned {len(answers_list)} answers.")
    assert len(answers_list) >= 1
    assert any(ans['id'] == db_answer.id for ans in answers_list)

    # 3. Test POST /api/answers/{id}/upvote/ (Vote on answer)
    response = client.post(f'/api/answers/{db_answer.id}/upvote/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    voted_ans = response.json()
    print(f"POST /api/answers/{db_answer.id}/upvote/ succeeded. Votes: {voted_ans['votes']}")
    assert voted_ans['votes'] == 1

    # 4. Test POST /api/pyqs/{pyq_id}/comments/ (Submit comment on PYQ question)
    comment_payload = {
        "body": "Is this question from GATE 2018 or 2019?"
    }
    response = client.post(
        f'/api/pyqs/{first_pyq.id}/comments/',
        data=comment_payload,
        content_type='application/json'
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    comm_data = response.json()
    print(f"POST /api/pyqs/{first_pyq.id}/comments/ (Create Comment) succeeded. ID: {comm_data['id']}")
    assert comm_data['body'] == comment_payload['body']

    # 5. Test GET /api/pyqs/{pyq_id}/comments/ (List comments)
    response = client.get(f'/api/pyqs/{first_pyq.id}/comments/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    comments_list = response.json()
    print(f"GET /api/pyqs/{first_pyq.id}/comments/ returned {len(comments_list)} comments.")
    assert len(comments_list) >= 1
    assert any(c['id'] == comm_data['id'] for c in comments_list)

    print("All PYQ Discussion Forum API endpoints verified successfully!")

if __name__ == '__main__':
    test_pyq_forum()
