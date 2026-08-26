import os
import sys
import json
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def submit_sample_to_grader(sample_name, pdf_path, question_text, rubric_text):
    print("\n" + "=" * 75)
    print(f" TESTING AI GRADER ON: {sample_name} ")
    print("=" * 75)
    print(f"PDF File: {pdf_path}")
    print(f"Question: {question_text}")
    print(f"Rubric:   {rubric_text}")

    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    boundary = "----NeuralSparkTestBoundary12345"
    parts = []
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"question\"\r\n\r\n{question_text}\r\n".encode("utf-8"))
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"rubric\"\r\n\r\n{rubric_text}\r\n".encode("utf-8"))
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"student_answer_file\"; filename=\"{os.path.basename(pdf_path)}\"\r\nContent-Type: application/pdf\r\n\r\n".encode("utf-8") + pdf_bytes + b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    
    payload = b"".join(parts)
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(payload))
    }

    url = "http://127.0.0.1:8000/api/products/ai-grader/"
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=35) as res:
            data = json.loads(res.read().decode("utf-8"))
            eval_text = data.get("evaluation", "")
            print("\n>>> AI GRADER OUTPUT:")
            print(eval_text)
            return True, eval_text
    except Exception as e:
        print(f"Error grading sample {sample_name}: {e}")
        return False, str(e)

def run_sample_suite():
    # Sample 1: Handwritten Scanned PDF (Eigenvalues)
    submit_sample_to_grader(
        "Sample 1: Handwritten Scanned PDF (Matrix Eigenvalues)",
        "Sample_Handwritten_Eigenvalues_Answer.pdf",
        "Find the eigenvalues of 2x2 matrix A = [[4, 1], [2, 3]].",
        "Max 5 Marks: 2 marks for characteristic equation det(A - lambda*I) = 0; 2 marks for polynomial lambda^2 - 7lambda + 10 = 0; 1 mark for correct eigenvalues lambda in {5, 2}."
    )

    # Sample 2: Master Theorem Derivation (Perfect Answer)
    submit_sample_to_grader(
        "Sample 2: Master Theorem Recurrence Proof (Perfect Score)",
        "Sample_Master_Theorem_Derivation.pdf",
        "State Master Theorem formulation and derive the tight bound for T(n) = 2T(n/2) + Theta(n).",
        "Max 5 Marks: 2 marks for stating standard Master Theorem form; 2 marks for computing critical exponent log_b(a) = 1; 1 mark for Theta(n log n) by Case 2."
    )

    # Sample 3: Flawed Binary Search Answer (Deduction Test)
    submit_sample_to_grader(
        "Sample 3: Flawed Binary Search Answer (Point Deductions Test)",
        "Sample_Flawed_BinarySearch_Answer.pdf",
        "Explain the working principle and derive the exact time complexity of Binary Search.",
        "Max 5 Marks: 2 marks for stating O(log n); 2 marks for explaining halving search space at each comparison; 1 mark for sorted input requirement."
    )

    # Sample 4: ML Binary Cross-Entropy Derivative (Math Proof)
    submit_sample_to_grader(
        "Sample 4: Machine Learning Binary Cross-Entropy Gradient Derivation",
        "Sample_ML_BinaryCrossEntropy_Answer.pdf",
        "Prove that the derivative of Binary Cross-Entropy loss with respect to logit z is y_hat - y.",
        "Max 5 Marks: 2 marks for sigmoid derivative d(y_hat)/dz = y_hat(1-y_hat); 2 marks for dL/d(y_hat) = (y_hat-y)/(y_hat(1-y_hat)); 1 mark for chain rule simplification to y_hat - y."
    )

if __name__ == "__main__":
    run_sample_suite()
