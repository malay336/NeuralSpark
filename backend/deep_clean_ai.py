import os
import django
import sys
import re
import time
from groq import Groq

# Add backend to path to import models
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_learning_project.settings')
django.setup()

from core.models import PYQ

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def clean_text_with_ai(text):
    if not text or len(text) < 10:
        return text
    
    # Fast check: if no excessive spacing, skip AI
    if text.count(' ') < len(text) / 5 and "Extracted from" not in text:
        return text

    try:
        prompt = f"""
        Fix the following mangled text extracted from a PDF. 
        1. Remove any PDF artifacts like "Extracted from... .pdf" or footer junk.
        2. Fix the spacing between letters (e.g., "C o u n t" -> "Count").
        3. Do NOT change the meaning or the numbers.
        4. Return ONLY the cleaned text.
        
        TEXT:
        {text}
        """
        
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"  AI error: {e}")
        return text

def main():
    # Only clean IDs that haven't been fixed (IDs > 5)
    pyqs = PYQ.objects.filter(id__gt=5).order_by('id')
    print(f"Starting AI-powered cleaning for {pyqs.count()} PYQs...")
    
    for i, p in enumerate(pyqs):
        print(f"  [{i+1}/{pyqs.count()}] Cleaning ID {p.id}...")
        p.question_text = clean_text_with_ai(p.question_text)
        p.answer_text = clean_text_with_ai(p.answer_text)
        p.save()
        
        # Batching/throttling to avoid rate limits
        if (i+1) % 10 == 0:
            time.sleep(1)

    print("Success! All entries processed.")

if __name__ == "__main__":
    main()
