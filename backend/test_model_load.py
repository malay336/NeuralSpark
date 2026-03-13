import sys
import logging
from pathlib import Path
import traceback

logging.basicConfig(level=logging.DEBUG)

model_path = Path("c:/Users/singh/.gemini/antigravity/scratch/gateoverflow_clone/ai_grader_model_customized")

try:
    from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
    import torch
    
    print(f"Loading tokenizer from {model_path}...")
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    print("Tokenizer loaded successfully.")
    
    print(f"Loading model from {model_path}...")
    model = AutoModelForSequenceClassification.from_pretrained(model_path, num_labels=1)
    print("Model loaded successfully.")
    
    print("Creating pipeline...")
    custom_grader_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer, device="cpu")
    print("Pipeline created successfully.")
    
except Exception as e:
    print(f"\nFailed to load custom model!")
    print(traceback.format_exc())
