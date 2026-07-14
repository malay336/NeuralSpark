import os
import sys
import django
from django.test import Client

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

def test_ai_assistant():
    print("Testing AI Assistant endpoint...")
    client = Client()

    payload = {
        "question": "What is the time complexity of lookup in a hash map?"
    }

    # Test POST /api/ai-assistant/ask/
    response = client.post(
        '/api/ai-assistant/ask/',
        data=payload,
        content_type='application/json'
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    data = response.json()
    assert 'response' in data, "Response key missing from payload"
    
    print("GET/POST AI Assistant output:")
    print(f" - Prompt: {payload['question']}")
    print(f" - Response snippet: {data['response'][:150]}...")
    
    print("AI Assistant integration test verified successfully!")

if __name__ == '__main__':
    test_ai_assistant()
