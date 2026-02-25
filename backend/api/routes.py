from ninja import NinjaAPI
from django.shortcuts import get_object_or_404
from typing import List
from core.models import Question, Answer, Comment, Tag, User, Category, Lecture, PYQ, Product, Service
from .schemas import (
    QuestionOutSchema, QuestionInSchema,
    AnswerOutSchema, AnswerInSchema,
    CommentOutSchema, CommentInSchema,
    CategorySchema, LectureSchema, PYQSchema, ProductSchema, ServiceSchema
)

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
    return Question.objects.all().order_by('-created_at')

@api.post("/questions", response=QuestionOutSchema)
def create_question(request, payload: QuestionInSchema):
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
    user = get_current_user()
    question = get_object_or_404(Question, id=q_id)
    answer = Answer.objects.create(
        author=user,
        question=question,
        body=payload.body
    )
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
    return Lecture.objects.all().order_by('order', '-created_at')

@api.get("/pyqs", response=List[PYQSchema])
def list_pyqs(request):
    return PYQ.objects.all().order_by('-year')

@api.get("/products", response=List[ProductSchema])
def list_products(request):
    return Product.objects.all().order_by('-created_at')

@api.get("/services", response=List[ServiceSchema])
def list_services(request):
    return Service.objects.all().order_by('-created_at')
