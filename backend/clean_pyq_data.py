import os
import django
import sys
import re

# Add backend to path to import models
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import PYQ

def clean_text(text):
    if not text:
        return text
    
    # 1. Remove "Extracted from..." and similar PDF footer junk
    # Matches "Extracted from XXX.pdf" or "DPP 01.pdf" etc.
    text = re.sub(r'Extracted from.*?\.(pdf|png|jpg|jpeg|webp)\.?', '', text, flags=re.IGNORECASE)
    
    # 2. Fix the split-character spacing issue for messed up PDF exports
    # Heuristic: if spaces are very frequent, treat double spaces as real, single as noise
    if text.count(' ') > len(text) / 4:
        # Normalize: replace 3+ spaces with 2, then protect double spaces
        text = re.sub(r'\s{3,}', '  ', text)
        text = text.replace('  ', '____REAL_SPACE____')
        # Remove single spaces (PDF character-level artifacts)
        text = text.replace(' ', '')
        # Restore real spaces
        text = text.replace('____REAL_SPACE____', ' ')
    
    # Final cleanup of any trailing/leading whitespace or leftover artifact dots
    text = text.strip()
    return text

def main():
    pyqs = PYQ.objects.all()
    print(f"Starting deep cleaning of {pyqs.count()} PYQs...")
    count = 0
    for p in pyqs:
        old_q = p.question_text
        old_a = p.answer_text
        
        new_q = clean_text(old_q)
        new_a = clean_text(old_a)
        
        # Special check: if answer was just the "Extracted from" line, it becomes empty
        # If it's empty, we might as well keep it empty for the frontend placeholder
        
        if new_q != old_q or new_a != old_a:
            p.question_text = new_q
            p.answer_text = new_a
            p.save()
            count += 1
            if count % 50 == 0:
                print(f"  Processed {count} records...")
            
    print(f"Final Success! Cleaned {count} entries total.")

if __name__ == "__main__":
    main()
