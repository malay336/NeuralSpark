import os
import sys
import django
from django.test import Client

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import PYQ

def test_practice_feed():
    print("Testing Practice Feed & categorizations...")
    client = Client()

    # 1. Test GET /api/pyqs/
    response = client.get('/api/pyqs/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"GET /api/pyqs/ returned {len(data)} total questions.")
    
    pyqs_count = sum(1 for q in data if q['is_pyq'])
    practice_count = sum(1 for q in data if not q['is_pyq'])
    print(f" - Found {pyqs_count} GATE PYQ questions.")
    print(f" - Found {practice_count} General Practice questions.")

    assert practice_count >= 3, f"Expected at least 3 general practice questions, got {practice_count}"
    
    # 2. Check schema format
    for q in data:
        assert 'is_pyq' in q, "is_pyq flag missing in response!"
        if not q['is_pyq']:
            assert q['year'] is None, "General practice question should have null year!"
        else:
            assert q['year'] is not None, "PYQ question must have an associated year!"

    print("Practice feed categorizations verified successfully!")

if __name__ == '__main__':
    test_practice_feed()
