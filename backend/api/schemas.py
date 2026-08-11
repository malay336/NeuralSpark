from ninja import ModelSchema, Schema
from typing import List, Optional
from datetime import datetime
from core.models import User, Tag, Question, Answer, Comment, Category, Lecture, PYQ, Product, Service, Inquiry, Quiz, QuizQuestion, QuizOption, Article

class CategorySchema(ModelSchema):
    """Schema for serializing Category objects for lists and nested relationships."""
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class LectureSchema(ModelSchema):
    """
    Schema for Video Lectures. Includes the nested CategorySchema to 
    provide the frontend with the full category details, not just the ID.
    """
    category: Optional[CategorySchema] = None
    class Meta:
        model = Lecture
        fields = ['id', 'title', 'description', 'video_url', 'order', 'created_at']

class PYQSchema(ModelSchema):
    """Schema for Previous Year Questions, including the subject details."""
    subject: CategorySchema
    class Meta:
        model = PYQ
        fields = ['id', 'year', 'is_pyq', 'question_text', 'answer_text', 'video_url', 'created_at']


class ProductSchema(ModelSchema):
    """Schema for Products (e.g., mock tests) with basic details and purchase links."""
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image_url', 'purchase_link', 'created_at']

class ServiceSchema(ModelSchema):
    """Schema for Services available for booking on the frontend."""
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'image_url', 'contact_link', 'created_at']

class UserSchema(ModelSchema):
    """Schema for safely exposing User details (excluding passwords or sensitive info)."""
    class Meta:
        model = User
        fields = ['id', 'username', 'reputation', 'bio']

class TagSchema(ModelSchema):
    """Schema for Tags used on community questions."""
    class Meta:
        model = Tag
        fields = ['id', 'name']

class QuestionOutSchema(ModelSchema):
    """
    Schema for outgoing Question data. 
    Nests the UserSchema for the author and TagSchema for the tags.
    """
    author: UserSchema
    tags: List[TagSchema]
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'body', 'video_url', 'is_video_approved', 'created_at', 'views', 'votes']

class QuestionInSchema(Schema):
    """
    Schema for incoming payload when a user creates a new Question.
    Accepts raw strings for tags to create or link them on the backend.
    """
    title: str
    body: str
    video_url: Optional[str] = None
    tags: List[str] = [] # list of tag names

class AnswerOutSchema(ModelSchema):
    """Schema for outgoing Answer data, including the author details."""
    author: UserSchema
    
    class Meta:
        model = Answer
        fields = ['id', 'body', 'is_approved', 'created_at', 'votes']

class AnswerInSchema(Schema):
    """Schema for the payload when a user submits a new Answer."""
    body: str

class CommentOutSchema(ModelSchema):
    """Schema for outgoing Comment data."""
    author: UserSchema

    class Meta:
        model = Comment
        fields = ['id', 'body', 'created_at']

class CommentInSchema(Schema):
    """Schema for the payload when a user comments on a question or answer."""
    body: str

class AIGraderInSchema(Schema):
    """
    Schema representing the evaluation logic for the text-based 
    AI Grader form before we added multimodal support.
    """
    question: str
    rubric: str
    student_answer: str

class AIGraderOutSchema(Schema):
    """Schema for returning the LLM's evaluation string back to the user."""
    evaluation: str

class InquiryInSchema(Schema):
    """
    Schema for the incoming contact form payload on the Services page.
    Optional service_id allows linking the inquiry to a specific service.
    """
    name: str
    email: str
    service_id: Optional[int] = None
    message: str

class InquiryOutSchema(ModelSchema):
    """Schema for returning the confirmed Inquiry back to the frontend."""
    service: Optional[ServiceSchema] = None
    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'email', 'message', 'created_at']

class QuizOptionSchema(ModelSchema):
    class Meta:
        model = QuizOption
        fields = ['id', 'option_text']  # EXCLUDES is_correct to prevent client-side cheating

class QuizQuestionSchema(ModelSchema):
    options: List[QuizOptionSchema]
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text']

class QuizDetailSchema(ModelSchema):
    questions: List[QuizQuestionSchema]
    category: CategorySchema
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'category']

class QuizListSchema(ModelSchema):
    category: CategorySchema
    question_count: int = 0
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'category']


class QuizAnswerSubmission(Schema):
    question_id: int
    selected_option_id: int

class QuizSubmissionIn(Schema):
    answers: List[QuizAnswerSubmission]

class QuestionResultOut(Schema):
    question_id: int
    correct_option_id: int
    is_correct: bool
    explanation: Optional[str] = None

class QuizSubmissionOut(Schema):
    quiz_id: int
    score: int
    total_questions: int
    results: List[QuestionResultOut]


class AIAssistantInSchema(Schema):
    question: str

class AIAssistantOutSchema(Schema):
    response: str


class ArticleListSchema(ModelSchema):
    subject: CategorySchema
    class Meta:
        model = Article
        fields = ['id', 'title', 'summary', 'created_at']

class ArticleDetailSchema(ModelSchema):
    subject: CategorySchema
    class Meta:
        model = Article
        fields = ['id', 'title', 'summary', 'content', 'created_at']


class UploadResponseSchema(Schema):
    success: bool
    message: str
    items_created: int = 0
    details: Optional[List[str]] = []

class PYQUploadInSchema(Schema):
    question_text: str
    answer_text: Optional[str] = ""
    year: Optional[int] = None
    is_pyq: bool = True
    subject_name: Optional[str] = "General CS & AI"
    video_url: Optional[str] = None

class ArticleUploadInSchema(Schema):
    title: str
    summary: str
    content: str
    subject_name: Optional[str] = "General CS & AI"

class LectureUploadInSchema(Schema):
    title: str
    description: Optional[str] = ""
    video_url: str
    subject_name: Optional[str] = "General CS & AI"
    order: Optional[int] = 0

class QuizOptionInSchema(Schema):
    option_text: str
    is_correct: bool = False

class QuizQuestionInSchema(Schema):
    question_text: str
    explanation: Optional[str] = ""
    options: List[QuizOptionInSchema]

class QuizUploadInSchema(Schema):
    title: str
    description: Optional[str] = ""
    subject_name: Optional[str] = "General CS & AI"
    questions: List[QuizQuestionInSchema]

class ManualUploadInSchema(Schema):
    content_type: str # 'pyq', 'question', 'article', 'lecture', 'quiz'
    pyq: Optional[PYQUploadInSchema] = None
    question: Optional[QuestionInSchema] = None
    article: Optional[ArticleUploadInSchema] = None
    lecture: Optional[LectureUploadInSchema] = None
    quiz: Optional[QuizUploadInSchema] = None

class BatchJSONInSchema(Schema):
    content_type: str # 'pyq', 'question', 'article', 'lecture', 'quiz'
    json_data: str # JSON array string



