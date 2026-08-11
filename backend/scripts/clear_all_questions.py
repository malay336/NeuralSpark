import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_learning_project.settings")
django.setup()

from core.models import PYQ, Question, Answer, Comment, Quiz, QuizQuestion, QuizOption, Category

OFFICIAL_SUBJECTS = [
    "LINEAR ALGEBRA",
    "PROBABILITY",
    "CALCULUS",
    "PYTHON PROGRAMMING",
    "DATA STRUCTURE & ALGORITHM",
    "MACHINE LEARNING",
    "AI",
    "GENERAL APTITUDE"
]

def clear_questions():
    print("Clearing all uploaded questions from database...")

    pyq_count, _ = PYQ.objects.all().delete()
    print(f"Deleted {pyq_count} PYQs / Practice Questions.")

    q_count, _ = Question.objects.all().delete()
    print(f"Deleted {q_count} Community Questions.")

    ans_count, _ = Answer.objects.all().delete()
    print(f"Deleted {ans_count} Answers.")

    comm_count, _ = Comment.objects.all().delete()
    print(f"Deleted {comm_count} Comments.")

    qq_count, _ = QuizQuestion.objects.all().delete()
    qo_count, _ = QuizOption.objects.all().delete()
    qz_count, _ = Quiz.objects.all().delete()
    print(f"Deleted {qz_count} Quizzes ({qq_count} quiz questions, {qo_count} quiz options).")

    # Ensure the 8 official subjects exist
    for subj in OFFICIAL_SUBJECTS:
        Category.objects.get_or_create(name=subj)

    print("\nDATABASE SUCCESSFULLY CLEARED OF ALL QUESTIONS!")
    print(f"Active Categories ({Category.objects.count()}): {[c.name for c in Category.objects.all()]}")

if __name__ == "__main__":
    clear_questions()
