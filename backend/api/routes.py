from ninja import NinjaAPI
from django.shortcuts import get_object_or_404
from typing import List
from core.models import Question, Answer, Comment, Tag, User, Category, Lecture, PYQ, Product, Service, Inquiry
from .schemas import (
    QuestionOutSchema, QuestionInSchema,
    AnswerOutSchema, AnswerInSchema,
    CommentOutSchema, CommentInSchema,
    CategorySchema, LectureSchema, PYQSchema, ProductSchema, ServiceSchema,
    AIGraderInSchema, AIGraderOutSchema,
    InquiryInSchema, InquiryOutSchema
)
import os
from groq import Groq

# In a real app we'd use proper auth. 
# For testing the MVP, we will fetch the first user or create one.
def get_current_user():
    user, created = User.objects.get_or_create(username='testuser')
    return user

api = NinjaAPI()

@api.get("/hello")
def hello(request):
    return {"message": "Hello from NeuralSpark"}

@api.get("/questions", response=List[QuestionOutSchema])
def list_questions(request):
    """
    Retrieves all community questions from the database.
    Ordered descending by creation date (newest first).
    """
    return Question.objects.all().order_by('-created_at')

@api.post("/questions", response=QuestionOutSchema)
def create_question(request, payload: QuestionInSchema):
    """
    Creates a new community Q&A question.
    Parses string tags from the payload and creates them if they do not exist.
    """
    user = get_current_user()
    question = Question.objects.create(
        author=user,
        title=payload.title,
        body=payload.body,
        video_url=payload.video_url
    )
    for tag_name in payload.tags:
        tag, _ = Tag.objects.get_or_create(name=tag_name)
        question.tags.add(tag)
    return question

@api.get("/questions/{q_id}", response=QuestionOutSchema)
def get_question(request, q_id: int):
    """
    Fetches a single question by ID.
    Increments the view count by 1 every time this endpoint is hit.
    """
    q = get_object_or_404(Question, id=q_id)
    q.views += 1
    q.save()
    return q

@api.get("/questions/{q_id}/answers", response=List[AnswerOutSchema])
def list_answers(request, q_id: int):
    # Only return approved answers
    return Answer.objects.filter(question_id=q_id, is_approved=True).order_by('-votes', 'created_at')

@api.post("/questions/{q_id}/answers", response=AnswerOutSchema)
def create_answer(request, q_id: int, payload: AnswerInSchema):
    """
    Allows a user to submit a new answer to a specific question.
    """
    user = get_current_user()
    question = get_object_or_404(Question, id=q_id)
    answer = Answer.objects.create(
        author=user,
        question=question,
        body=payload.body
    )
    return answer

@api.post("/answers/{a_id}/upvote", response=AnswerOutSchema)
def upvote_answer(request, a_id: int):
    """Increments the vote count on an answer by 1."""
    answer = get_object_or_404(Answer, id=a_id)
    answer.votes += 1
    answer.save()
    return answer

@api.post("/answers/{a_id}/downvote", response=AnswerOutSchema)
def downvote_answer(request, a_id: int):
    """Decrements the vote count on an answer by 1."""
    answer = get_object_or_404(Answer, id=a_id)
    answer.votes -= 1
    answer.save()
    return answer

@api.post("/answers/{a_id}/comments", response=CommentOutSchema)
def create_answer_comment(request, a_id: int, payload: CommentInSchema):
    user = get_current_user()
    answer = get_object_or_404(Answer, id=a_id)
    comment = Comment.objects.create(
        author=user,
        answer=answer,
        body=payload.body
    )
    return comment

@api.get("/categories", response=List[CategorySchema])
def list_categories(request):
    return Category.objects.all()

@api.get("/lectures", response=List[LectureSchema])
def list_lectures(request):
    """
    Fetches all video lectures, ordering them by their assigned Sequence 
    (Course Chapter) order.
    """
    return Lecture.objects.all().order_by('order', '-created_at')

@api.get("/pyqs", response=List[PYQSchema])
def list_pyqs(request):
    return PYQ.objects.all().order_by('-year')

@api.get("/products", response=List[ProductSchema])
def list_products(request):
    return Product.objects.all().order_by('-created_at')

@api.get("/services", response=List[ServiceSchema])
def list_services(request):
    """Lists available premium services (mentorship, consulting, etc.)."""
    return Service.objects.all().order_by('-created_at')

@api.post("/inquiries", response=InquiryOutSchema)
def create_inquiry(request, payload: InquiryInSchema):
    """
    Receives contact form submissions. Links them to a specific Service 
    if a `service_id` is provided in the payload.
    """
    service = None
    if payload.service_id:
        service = get_object_or_404(Service, id=payload.service_id)
    inquiry = Inquiry.objects.create(
        name=payload.name,
        email=payload.email,
        service=service,
        message=payload.message
    )
    return inquiry

from ninja import Form, File
from ninja.files import UploadedFile
import base64
import PyPDF2
from typing import Optional

def _process_uploaded_file(file: UploadedFile, label: str):
    """
    Helper function to process multimodal file uploads for the AI Grader.
    - If it's a PDF, extracts the raw text via PyPDF2.
    - If it's an Image, reads the bytes, encodes to base64, and formats
      it as an image_url object for the Groq Vision model.
    """
    if not file:
        return None
    
    # If PDF, extract text and return a text message
    if file.name.endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(file.file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return {"type": "text", "text": f"\n--- {label} (Extracted from PDF) ---\n" + text}
        except Exception as e:
            return {"type": "text", "text": f"\n--- {label} (Error reading PDF) ---\n"}
            
    # If image, encode to base64 and return image_url message
    elif file.name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        try:
            base64_image = base64.b64encode(file.file.read()).decode('utf-8')
            return {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
            }
        except Exception:
            pass
    return None

@api.post("/products/ai-grader", response=AIGraderOutSchema)
def ai_grader_endpoint(
    request, 
    question: str = Form(""),
    rubric: str = Form(""),
    student_answer: str = Form(""),
    question_file: UploadedFile = File(None),
    rubric_file: UploadedFile = File(None),
    student_answer_file: UploadedFile = File(None)
):
    """
    The main logic for the AI Assignment Grader.
    Constructs a dynamic multimodal payload from text inputs and uploaded files (PDFs/Images).
    Sends the compiled payload to Groq's `llama-3.2-11b-vision-preview` LLM model
    for automated grading and feedback generation.
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    system_prompt = """
    You are an expert Computer Science teaching assistant. Your job is to grade student submissions accurately and fairly.
    You must strictly follow the provided rubric.

    Output your evaluation EXACTLY in this format:
    Score: [Points]/[Total Possible Points]
    Feedback: [1-2 sentences explaining the score, highlighting any missing concepts or correct logic.]
    """

    user_content = []
    
    # Text prompts
    if question.strip():
        user_content.append({"type": "text", "text": f"Question:\n{question}\n"})
    if rubric.strip():
        user_content.append({"type": "text", "text": f"Rubric:\n{rubric}\n"})
    if student_answer.strip():
        user_content.append({"type": "text", "text": f"Student Answer:\n{student_answer}\n"})

    # Process files
    q_msg = _process_uploaded_file(question_file, "Question Attached File")
    if q_msg: user_content.append(q_msg)
        
    r_msg = _process_uploaded_file(rubric_file, "Rubric Attached File")
    if r_msg: user_content.append(r_msg)
        
    s_msg = _process_uploaded_file(student_answer_file, "Student Answer Attached File")
    if s_msg: user_content.append(s_msg)

    if not user_content:
        return {"evaluation": "No question, rubric, or answer provided."}

    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.1,
        )
        return {"evaluation": completion.choices[0].message.content}
    except Exception as e:
        return {"evaluation": f"Error during grading: {str(e)}"}
