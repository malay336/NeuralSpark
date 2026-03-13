import json
import random
import os

output_file = r"C:\Users\singh\.gemini\antigravity\scratch\gateoverflow_clone\ml_grader_dataset.jsonl"

# We define a few core topics, their questions, strict rubrics, and variations of student answers.
topics = [
    {
        "question": "Explain how the Binary Search algorithm works and state its time complexity.",
        "rubric": "1. Mentions dividing the array in half (4 pts). 2. Requires a sorted array (3 pts). 3. Correct time complexity O(log n) (3 pts).",
        "answers": [
            {"text": "Binary search works by repeatedly dividing the sorted array in half. The time complexity is O(log n).", "score": "10/10", "feedback": "Excellent answer. You correctly identified that it requires a sorted array, explained the divide and conquer mechanism, and gave the correct time complexity."},
            {"text": "It cuts the array in half until it finds the target. It's O(log n).", "score": "7/10", "feedback": "Good answer, but you forgot to mention that the array must be sorted first for binary search to work."},
            {"text": "Binary search looks at every element one by one until it finds what it needs. Time complexity is O(n).", "score": "0/10", "feedback": "Incorrect. You are describing Linear Search, not Binary Search. Binary search requires a sorted array and divides the search space in half each time, resulting in O(log n) complexity."},
            {"text": "You need a sorted list. You check the middle element. If it's smaller, you search the right half. If larger, the left half. It takes O(log n) time.", "score": "10/10", "feedback": "Perfect response. Clear explanation of the mechanics, mentions the sorted requirement, and correctly states O(log n)."}
        ]
    },
    {
        "question": "What is the primary difference between a stack and a queue?",
        "rubric": "1. Stack is LIFO (Last-In, First-Out) (5 pts). 2. Queue is FIFO (First-In, First-Out) (5 pts).",
        "answers": [
            {"text": "A stack is Last In First Out (LIFO), like a stack of plates. A queue is First In First Out (FIFO), like a line at a store.", "score": "10/10", "feedback": "Perfect. You clearly defined both data structures with their correct acronyms and helpful analogies."},
            {"text": "They are both used to store data, but a stack uses FIFO and a queue uses LIFO.", "score": "0/10", "feedback": "Incorrect. You have the definitions swapped. A stack is LIFO (Last-In, First-Out) and a queue is FIFO (First-In, First-Out)."},
            {"text": "Stacks are LIFO. Queues are for when you need things in order.", "score": "7/10", "feedback": "Partial credit. You correctly identified a stack as LIFO, but your definition of a queue is too vague. You should explicitly mention it is FIFO (First-In, First-Out)."},
            {"text": "In a queue, the first element added is the first one removed. In a stack, the most recently added element is removed first.", "score": "10/10", "feedback": "Great answer. You correctly described the correct LIFO and FIFO behaviors without explicitly using the acronyms."}
        ]
    },
    {
        "question": "Describe the concept of an SQL foreign key and its purpose.",
        "rubric": "1. Defines foreign key as a column referencing a primary key in another table (5 pts). 2. Mentions referential integrity or linking tables (5 pts).",
        "answers": [
            {"text": "A foreign key is a column in one table that links to the primary key of another table. It is used to maintain referential integrity.", "score": "10/10", "feedback": "Excellent. You provided a clear definition and correctly identified its purpose in maintaining referential integrity."},
            {"text": "It links two tables together.", "score": "5/10", "feedback": "Partial credit. While it does link tables, your answer lacks technical detail. You must mention that it references the Primary Key of the other table to enforce referential integrity."},
            {"text": "A foreign key is a unique identifier for a table, ensuring no duplicate rows exist.", "score": "0/10", "feedback": "Incorrect. You are describing a Primary Key, not a Foreign Key. A Foreign Key is used to link to the Primary Key of a *different* table."}
        ]
    }
]

# Generate synthetic dataset by introducing slight random variations (simulating different students)
# In real life, you need thousands. We'll generate a sample of ~100 for the purpose of a Colab tutorial.
dataset = []

# System prompt that we will use during training
SYSTEM_PROMPT = """You are an expert Computer Science grading assistant. Calculate a score based on the rubric and provide 1-2 sentences of helpful feedback."""

for _ in range(30):
    for topic in topics:
        for answer in topic["answers"]:
            # Format required by HuggingFace / Llama 3 Chat Templates
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Question: {topic['question']}\n\nRubric: {topic['rubric']}\n\nStudent Answer: {answer['text']}"},
                {"role": "assistant", "content": f"Score: {answer['score']}\nFeedback: {answer['feedback']}"}
            ]
            dataset.append({"messages": messages})

random.shuffle(dataset)

with open(output_file, 'w', encoding='utf-8') as f:
    for item in dataset:
        f.write(json.dumps(item) + '\n')

print(f"Dataset generated successfully! Created {len(dataset)} examples at {output_file}")
print("Format: JSONL with OpenAI/Llama 3 Chat Template structure.")
