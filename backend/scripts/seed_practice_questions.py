import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import Category, PYQ

def seed_practice_questions():
    print("Seeding general practice questions (is_pyq=False)...")

    # Fetch categories
    dsa_cat, _ = Category.objects.get_or_create(name='DSA')
    ai_cat, _ = Category.objects.get_or_create(name='AI')
    dbms_cat, _ = Category.objects.get_or_create(name='dbms')

    # DSA Practice Question
    dsa_pq, created = PYQ.objects.get_or_create(
        question_text="Design an efficient method to detect if a cycle exists in a singly linked list. What is the time and space complexity?",
        subject=dsa_cat,
        is_pyq=False,
        defaults={
            "answer_text": "The optimal approach to detect a cycle in a linked list is Floyd's Cycle-Finding Algorithm (often called the tortoise and hare algorithm).\n\n"
                           "1. Initialize two pointers, slow and fast, at the head of the linked list.\n"
                           "2. In each iteration, move slow pointer forward by one step, and fast pointer by two steps.\n"
                           "3. If there is no cycle, the fast pointer will eventually reach the end (NULL).\n"
                           "4. If there is a cycle, the fast pointer will catch up to the slow pointer, and they will meet at the same node.\n\n"
                           "Complexity:\n"
                           "- Time Complexity: O(n) where n is the number of nodes in the linked list.\n"
                           "- Space Complexity: O(1) as we only use two pointer references.",
            "year": None
        }
    )
    if created:
        print(f"Created DSA practice question (ID: {dsa_pq.id})")

    # AI Practice Question
    ai_pq, created = PYQ.objects.get_or_create(
        question_text="What is the difference between supervised, unsupervised, and reinforcement learning?",
        subject=ai_cat,
        is_pyq=False,
        defaults={
            "answer_text": "Here is the comparison:\n\n"
                           "1. Supervised Learning: The model learns on labeled data containing inputs and corresponding correct targets (e.g. classification or regression tasks).\n"
                           "2. Unsupervised Learning: The model analyzes unlabeled data to uncover hidden structures, groupings, or clusters (e.g. K-Means clustering, PCA).\n"
                           "3. Reinforcement Learning: An agent learns to make decisions by performing actions in an environment and receiving rewards or penalties (e.g. Q-Learning, robotics pathfinding).",
            "year": None
        }
    )
    if created:
        print(f"Created AI practice question (ID: {ai_pq.id})")

    # DBMS Practice Question
    dbms_pq, created = PYQ.objects.get_or_create(
        question_text="Explain the concept of ACID properties in Database Management Systems.",
        subject=dbms_cat,
        is_pyq=False,
        defaults={
            "answer_text": "ACID properties ensure relational databases maintain transaction reliability:\n\n"
                           "1. Atomicity: The entire transaction succeeds or fails as a single unit ('all or nothing').\n"
                           "2. Consistency: A transaction must transition the database from one valid state to another, maintaining all schema integrity rules.\n"
                           "3. Isolation: Concurrent execution of transactions yields the same database state as if they were run sequentially.\n"
                           "4. Durability: Once a transaction commits, its changes survive even in the event of system crashes or power failures.",
            "year": None
        }
    )
    if created:
        print(f"Created DBMS practice question (ID: {dbms_pq.id})")

    print("Practice questions seeding complete.")

if __name__ == '__main__':
    seed_practice_questions()
