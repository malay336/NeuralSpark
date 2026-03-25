import os
import sys
import django
import re
import PyPDF2
from pathlib import Path

# Setup Django environment
backend_path = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import Question, PYQ, Category, Tag, User

def populate_pw_dpp():
    # Ensure author exists
    author, _ = User.objects.get_or_create(username='testuser')
    
    questions_dir = backend_path.parent / "PW dpp"
    if not questions_dir.exists():
        print(f"Directory {questions_dir} not found.")
        return

    print(f"Processing questions from {questions_dir}...")

    # Set to track created categories to avoid repeat lookups
    processed_files = 0
    total_questions = 0

    for file in questions_dir.glob("*.pdf"):
        if "Discussion Notes" in file.name:
            continue
            
        # Extract category name from filename
        # e.g., "Adversarial Search  DPP 01.pdf" -> "Adversarial Search"
        match = re.split(r'\s+DPP|_DPP', file.stem, flags=re.IGNORECASE)
        category_name = match[0].strip()
        cat, _ = Category.objects.get_or_create(name=category_name)
        
        try:
            with open(file, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                full_text = ""
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        full_text += t + "\n"
                
                # Split by Q1, Q2, etc. (Look for Q followed by digits at start of line or after space)
                questions_raw = re.split(r'(?:\s|^)Q\d+', full_text)
                
                count = 0
                for i, q_text in enumerate(questions_raw):
                    q_text = q_text.strip()
                    # Filter out headers like "GATE" or very short snippets
                    if len(q_text) < 30 or q_text.strip() == "GATE":
                        continue
                    
                    # Clean up common PDF artifacts
                    q_text = re.sub(r'^GATE\s*', '', q_text, flags=re.MULTILINE).strip()
                    
                    # Avoid duplicates by title (approximate check)
                    title = f"{category_name} - {file.stem} - Q{count+1}"
                    if not Question.objects.filter(title=title).exists():
                        # Create Question in forum
                        Question.objects.create(
                            author=author,
                            title=title,
                            body=q_text,
                            category=cat
                        )
                        # Create PYQ in learning
                        PYQ.objects.create(
                            year=2024,
                            subject=cat,
                            question_text=q_text,
                            answer_text=f"Extracted from {file.name}."
                        )
                        count += 1
                
                total_questions += count
                processed_files += 1
                print(f"Uploaded {count} questions from {file.name} (Category: {category_name})")
        except Exception as e:
            print(f"Error processing {file.name}: {e}")

    print(f"Finished! Processed {processed_files} files, uploaded {total_questions} questions.")

if __name__ == "__main__":
    populate_pw_dpp()
