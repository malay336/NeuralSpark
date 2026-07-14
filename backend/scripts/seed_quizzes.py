import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import Category, Quiz, QuizQuestion, QuizOption

def seed_quizzes():
    print("Seeding practice quizzes...")

    # Fetch categories
    dsa_cat, _ = Category.objects.get_or_create(name='DSA', defaults={'description': 'Data Structures and Algorithms'})
    ai_cat, _ = Category.objects.get_or_create(name='AI', defaults={'description': 'Artificial Intelligence'})
    dbms_cat, _ = Category.objects.get_or_create(name='dbms', defaults={'description': 'Database Management Systems'})

    # 1. DSA Quiz
    dsa_quiz, created = Quiz.objects.get_or_create(
        title="Data Structures Fundamentals",
        category=dsa_cat,
        defaults={"description": "Test your knowledge of core data structures like arrays, stacks, queues, and trees."}
    )
    if created:
        print(f"Created quiz: {dsa_quiz.title}")
        # Q1
        q1 = QuizQuestion.objects.create(
            quiz=dsa_quiz,
            question_text="Which of the following data structures operates on a Last-In, First-Out (LIFO) basis?",
            explanation="A Stack is a LIFO (Last-In, First-Out) structure, meaning the element added most recently is the first to be removed. A Queue operates on a FIFO (First-In, First-Out) basis."
        )
        QuizOption.objects.create(question=q1, option_text="Queue", is_correct=False)
        QuizOption.objects.create(question=q1, option_text="Stack", is_correct=True)
        QuizOption.objects.create(question=q1, option_text="Linked List", is_correct=False)
        QuizOption.objects.create(question=q1, option_text="Binary Tree", is_correct=False)

        # Q2
        q2 = QuizQuestion.objects.create(
            quiz=dsa_quiz,
            question_text="What is the worst-case time complexity of searching in a balanced Binary Search Tree (BST)?",
            explanation="In a balanced Binary Search Tree (like AVL or Red-Black trees), the height is guaranteed to be O(log n), so search, insertion, and deletion operations all run in O(log n) worst-case time."
        )
        QuizOption.objects.create(question=q2, option_text="O(1)", is_correct=False)
        QuizOption.objects.create(question=q2, option_text="O(n)", is_correct=False)
        QuizOption.objects.create(question=q2, option_text="O(log n)", is_correct=True)
        QuizOption.objects.create(question=q2, option_text="O(n log n)", is_correct=False)

        # Q3
        q3 = QuizQuestion.objects.create(
            quiz=dsa_quiz,
            question_text="Which algorithm is typically used to find the shortest path in a weighted graph with non-negative edge weights?",
            explanation="Dijkstra's algorithm is specifically designed to find the shortest paths from a single source vertex to all other vertices in a weighted graph with non-negative weights. Bellman-Ford can handle negative weights but is slower."
        )
        QuizOption.objects.create(question=q3, option_text="Prim's Algorithm", is_correct=False)
        QuizOption.objects.create(question=q3, option_text="Kruskal's Algorithm", is_correct=False)
        QuizOption.objects.create(question=q3, option_text="Dijkstra's Algorithm", is_correct=True)
        QuizOption.objects.create(question=q3, option_text="Depth-First Search (DFS)", is_correct=False)

    # 2. AI Quiz
    ai_quiz, created = Quiz.objects.get_or_create(
        title="Introduction to Artificial Intelligence",
        category=ai_cat,
        defaults={"description": "Quiz covering core AI concepts, search strategies, and basic machine learning principles."}
    )
    if created:
        print(f"Created quiz: {ai_quiz.title}")
        # Q1
        q1 = QuizQuestion.objects.create(
            quiz=ai_quiz,
            question_text="Which of the following search algorithms is guaranteed to find the shallowest goal first and is complete?",
            explanation="Breadth-First Search (BFS) is complete and guarantees the shortest path (shallowest goal node) first in an unweighted graph, since it expands all nodes at a given depth level before moving deeper."
        )
        QuizOption.objects.create(question=q1, option_text="Depth-First Search (DFS)", is_correct=False)
        QuizOption.objects.create(question=q1, option_text="Breadth-First Search (BFS)", is_correct=True)
        QuizOption.objects.create(question=q1, option_text="Depth-Limited Search", is_correct=False)
        QuizOption.objects.create(question=q1, option_text="Greedy Best-First Search", is_correct=False)

        # Q2
        q2 = QuizQuestion.objects.create(
            quiz=ai_quiz,
            question_text="What is the key component that distinguishes informed search algorithms from uninformed ones?",
            explanation="Informed (heuristic) search algorithms like A* or Greedy Best-First Search utilize a heuristic function h(n) that estimates the cost from node n to the goal. Uninformed search has no information about the goal proximity."
        )
        QuizOption.objects.create(question=q2, option_text="Queue frontier", is_correct=False)
        QuizOption.objects.create(question=q2, option_text="Adjacency list representation", is_correct=False)
        QuizOption.objects.create(question=q2, option_text="Heuristic function", is_correct=True)
        QuizOption.objects.create(question=q2, option_text="Backtracking check", is_correct=False)

    # 3. DBMS Quiz
    dbms_quiz, created = Quiz.objects.get_or_create(
        title="Database Keys & Normalization",
        category=dbms_cat,
        defaults={"description": "Test your understanding of primary keys, foreign keys, and Normal Forms (1NF, 2NF, 3NF, BCNF)."}
    )
    if created:
        print(f"Created quiz: {dbms_quiz.title}")
        # Q1
        q1 = QuizQuestion.objects.create(
            quiz=dbms_quiz,
            question_text="Which integrity rule states that a primary key column cannot contain NULL values?",
            explanation="Entity Integrity constraint requires that no primary key attribute can be null. This ensures that every row is uniquely identifiable. Referential Integrity governs foreign keys."
        )
        QuizOption.objects.create(question=q1, option_text="Referential Integrity", is_correct=False)
        QuizOption.objects.create(question=q1, option_text="Entity Integrity", is_correct=True)
        QuizOption.objects.create(question=q1, option_text="Domain Constraint", is_correct=False)
        QuizOption.objects.create(question=q1, option_text="Key Constraint", is_correct=False)

        # Q2
        q2 = QuizQuestion.objects.create(
            quiz=dbms_quiz,
            question_text="A relation is in 2NF if it is in 1NF and contains no...",
            explanation="A relation is in 2NF (Second Normal Form) if it is in 1NF and contains no partial dependencies, meaning every non-prime attribute is fully functionally dependent on the entire primary key."
        )
        QuizOption.objects.create(question=q2, option_text="Transitive dependencies", is_correct=False)
        QuizOption.objects.create(question=q2, option_text="Partial dependencies", is_correct=True)
        QuizOption.objects.create(question=q2, option_text="Multivalued dependencies", is_correct=False)
        QuizOption.objects.create(question=q2, option_text="Functional dependencies", is_correct=False)

    print("Seeding complete.")

if __name__ == '__main__':
    seed_quizzes()
