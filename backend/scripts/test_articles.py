import os
import sys
import django
from django.test import Client

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import Article

def test_articles():
    print("Testing Theory Articles API endpoints...")
    client = Client()

    # 1. Test GET /api/articles/
    response = client.get('/api/articles/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"GET /api/articles/ returned {len(data)} articles.")
    assert len(data) >= 4, f"Expected at least 4 seeded articles, got {len(data)}"

    for art in data:
        print(f" - Found article '{art['title']}' under subject '{art['subject']['name']}'.")
        assert 'title' in art
        assert 'summary' in art
        assert 'subject' in art
        # List should not contain full content to save bandwidth
        assert 'content' not in art

    # 2. Test GET /api/articles/{id}/
    first_article = Article.objects.first()
    if not first_article:
        print("No articles found in database. Seeding may have failed.")
        return

    response = client.get(f'/api/articles/{first_article.id}/')
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    detail = response.json()
    print(f"GET /api/articles/{first_article.id}/ details loaded successfully.")
    assert 'content' in detail, "Detail response should contain full content body"
    print(f" - Content snippet: {detail['content'][:150]}...")

    print("All Theory Articles API endpoints verified successfully!")

if __name__ == '__main__':
    test_articles()
