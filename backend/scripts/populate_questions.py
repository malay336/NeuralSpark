import os
import sys
import django
from pathlib import Path

# Setup Django environment
backend_path = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

import PyPDF2
from core.models import Question, PYQ, Category, Tag, User

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return ""

def populate():
    # Ensure author exists (using testuser from routes.py)
    author, _ = User.objects.get_or_create(username='testuser')
    
    questions_dir = backend_path.parent / "questions"
    print(f"Calculated questions_dir: {questions_dir}")
    if not questions_dir.exists():
        print(f"Directory {questions_dir} not found.")
        return

    print(f"Processing questions from {questions_dir}...")
    
    # Check if we see any PDFs
    all_pdfs = list(questions_dir.glob("*.pdf"))
    print(f"Found {len(all_pdfs)} PDFs in root.")

    # Process files in the root (mock tests)
    for file in questions_dir.glob("*.pdf"):
        print(f"Checking file: {file.name}")
        text = extract_text_from_pdf(file)
        print(f"Extracted {len(text)} characters.")
        if text:
            cat, _ = Category.objects.get_or_create(name="Mock Tests")
            print(f"Category: {cat.name}")
            
            # Create Question in forum
            q = Question.objects.create(
                author=author,
                title=file.stem.replace("_", " ").title(),
                body=text[:5000],
                category=cat
            )
            print(f"Created Question: {q.id}")
            # Create PYQ in learning
            p = PYQ.objects.create(
                year=2024,
                subject=cat,
                question_text=text,
                answer_text="Automated extraction from PDF."
            )
            print(f"Created PYQ: {p.id}")
            print(f"Uploaded {file.name} to forum and learning (Category: Mock Tests)")
        else:
            print(f"No text extracted from {file.name}, skipping.")

    # Process subdirectories
    for subdir in [d for d in questions_dir.iterdir() if d.is_dir()]:
        category_name = subdir.name
        cat, _ = Category.objects.get_or_create(name=category_name)
        
        for file in subdir.glob("*.pdf"):
            text = extract_text_from_pdf(file)
            if text:
                Question.objects.create(
                    author=author,
                    title=file.stem.replace("_", " ").title(),
                    body=text[:5000],
                    category=cat
                )
                PYQ.objects.create(
                    year=2024,
                    subject=cat,
                    question_text=text,
                    answer_text=f"Material for {category_name} extracted from {file.name}."
                )
                print(f"Uploaded {file.name} to forum and learning (Category: {category_name})")

if __name__ == "__main__":
    populate()
