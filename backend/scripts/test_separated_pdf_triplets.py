import os
import sys
import json
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def test_separated_pdf_triplet(test_title, q_pdf, r_pdf, a_pdf):
    print("\n" + "=" * 75)
    print(f" TESTING MULTI-PDF UPLOAD: {test_title}")
    print("=" * 75)
    print(f"Question PDF: {os.path.basename(q_pdf)}")
    print(f"Rubric PDF:   {os.path.basename(r_pdf)}")
    print(f"Answer PDF:   {os.path.basename(a_pdf)}")

    boundary = "----NeuralSparkTripletBoundary789"
    parts = []

    # Read all 3 files
    with open(q_pdf, "rb") as f:
        q_bytes = f.read()
    with open(r_pdf, "rb") as f:
        r_bytes = f.read()
    with open(a_pdf, "rb") as f:
        a_bytes = f.read()

    # Part 1: Question File
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"question_file\"; filename=\"{os.path.basename(q_pdf)}\"\r\nContent-Type: application/pdf\r\n\r\n".encode("utf-8") + q_bytes + b"\r\n")

    # Part 2: Rubric File
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"rubric_file\"; filename=\"{os.path.basename(r_pdf)}\"\r\nContent-Type: application/pdf\r\n\r\n".encode("utf-8") + r_bytes + b"\r\n")

    # Part 3: Student Answer File
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"student_answer_file\"; filename=\"{os.path.basename(a_pdf)}\"\r\nContent-Type: application/pdf\r\n\r\n".encode("utf-8") + a_bytes + b"\r\n")

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
            print("\n>>> AI GRADER TRIPLE-PDF EVALUATION OUTPUT:")
            print(data.get("evaluation"))
            return True
    except Exception as e:
        print(f"Error testing triplet {test_title}: {e}")
        return False

def run_all_triplets():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "..", "sample_pdfs")

    # Triplet 1: Handwritten Linear Algebra
    test_separated_pdf_triplet(
        "Suite 1: Handwritten Linear Algebra Eigenvalues (3 Separate PDFs)",
        os.path.join(base_dir, "Question_1_Eigenvalues.pdf"),
        os.path.join(base_dir, "Rubric_1_Eigenvalues.pdf"),
        os.path.join(base_dir, "Answer_1_Eigenvalues_Handwritten.pdf")
    )

    # Triplet 2: Master Theorem Proof
    test_separated_pdf_triplet(
        "Suite 2: Master Theorem Divide-and-Conquer Proof (3 Separate PDFs)",
        os.path.join(base_dir, "Question_2_Master_Theorem.pdf"),
        os.path.join(base_dir, "Rubric_2_Master_Theorem.pdf"),
        os.path.join(base_dir, "Answer_2_Master_Theorem_Proof.pdf")
    )

    # Triplet 3: Flawed Binary Search
    test_separated_pdf_triplet(
        "Suite 3: Flawed Binary Search Answer (3 Separate PDFs)",
        os.path.join(base_dir, "Question_3_Binary_Search.pdf"),
        os.path.join(base_dir, "Rubric_3_Binary_Search.pdf"),
        os.path.join(base_dir, "Answer_3_Binary_Search_Flawed.pdf")
    )

if __name__ == "__main__":
    run_all_triplets()
