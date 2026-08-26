import io
import os
import sys
import json
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def test_handwritten_pdf():
    print("=" * 70)
    print("   TESTING HANDWRITTEN PDF GRADING SUPPORT IN NEURALSPARK   ")
    print("=" * 70)

    # 1. Create a mock scanned handwritten student answer PDF
    print("\n1. Generating mock scanned handwritten PDF page...")
    img = Image.new("RGB", (900, 1100), color=(250, 250, 252))
    draw = ImageDraw.Draw(img)

    # Simulate handwritten text
    header = "Student Roll No: 2303031249003\nCourse: Linear Algebra (GATE CS/DA)\nAssignment 2: Matrix Spectral Decomposition"
    body = (
        "\n\nQuestion: Find the eigenvalues of A = [[4, 1], [2, 3]].\n\n"
        "Handwritten Solution Steps:\n"
        "Step 1: Write characteristic equation det(A - lambda * I) = 0\n"
        "        | 4 - lambda     1        |\n"
        "        | 2          3 - lambda   | = 0\n\n"
        "Step 2: Expand the 2x2 determinant:\n"
        "        (4 - lambda)(3 - lambda) - (1)(2) = 0\n"
        "        12 - 4*lambda - 3*lambda + lambda^2 - 2 = 0\n"
        "        lambda^2 - 7*lambda + 10 = 0\n\n"
        "Step 3: Factorize the quadratic polynomial:\n"
        "        (lambda - 5)(lambda - 2) = 0\n\n"
        "Step 4: Final Eigenvalues:\n"
        "        lambda_1 = 5,  lambda_2 = 2. [Q.E.D.]"
    )

    draw.text((40, 40), header, fill=(80, 80, 100))
    draw.text((40, 140), body, fill=(20, 20, 90))

    pdf_buffer = io.BytesIO()
    img.save(pdf_buffer, format="PDF")
    pdf_bytes = pdf_buffer.getvalue()
    print(f"Generated handwritten scanned PDF size: {len(pdf_bytes)} bytes")

    # 2. Prepare multipart/form-data upload
    boundary = "----NeuralSparkBoundary9876543210"
    
    parts = []
    
    # Form field: question
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"question\"\r\n\r\nFind the eigenvalues of 2x2 matrix A = [[4, 1], [2, 3]].\r\n".encode("utf-8"))
    
    # Form field: rubric
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"rubric\"\r\n\r\nMax 5 Marks: 2 marks for characteristic equation det(A - lambda*I) = 0; 2 marks for characteristic polynomial lambda^2 - 7lambda + 10 = 0; 1 mark for correct eigenvalues lambda = 5 and lambda = 2.\r\n".encode("utf-8"))
    
    # Form field: student_answer_file (the PDF)
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"student_answer_file\"; filename=\"handwritten_eigenvalues_solution.pdf\"\r\nContent-Type: application/pdf\r\n\r\n".encode("utf-8") + pdf_bytes + b"\r\n")
    
    parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    
    payload = b"".join(parts)
    
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(payload))
    }

    url = "http://127.0.0.1:8000/api/products/ai-grader/"
    print(f"\n2. Sending handwritten PDF to AI Grader [{url}]...")
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=30) as res:
        resp_data = json.loads(res.read().decode("utf-8"))
        print("\n" + "=" * 70)
        print("          AI GRADER EVALUATION ON HANDWRITTEN PDF          ")
        print("=" * 70)
        print(resp_data.get("evaluation"))
        print("=" * 70)

if __name__ == "__main__":
    test_handwritten_pdf()
