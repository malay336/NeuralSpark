from ninja import ModelSchema, Schema
from typing import List, Optional
from datetime import datetime
from core.models import User, Tag, Question, Answer, Comment, Category, Lecture, PYQ, Product, Service

class CategorySchema(ModelSchema):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class LectureSchema(ModelSchema):
    category: Optional[CategorySchema] = None
    class Meta:
        model = Lecture
        fields = ['id', 'title', 'description', 'video_url', 'order', 'created_at']

class PYQSchema(ModelSchema):
    subject: CategorySchema
    class Meta:
        model = PYQ
        fields = ['id', 'year', 'question_text', 'answer_text', 'video_url', 'created_at']

class ProductSchema(ModelSchema):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image_url', 'purchase_link', 'created_at']

class ServiceSchema(ModelSchema):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'image_url', 'contact_link', 'created_at']

class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = ['id', 'username', 'reputation', 'bio']

class TagSchema(ModelSchema):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class QuestionOutSchema(ModelSchema):
    author: UserSchema
    tags: List[TagSchema]
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'body', 'video_url', 'is_video_approved', 'created_at', 'views', 'votes']

class QuestionInSchema(Schema):
    title: str
    body: str
    video_url: Optional[str] = None
    tags: List[str] = [] # list of tag names

class AnswerOutSchema(ModelSchema):
    author: UserSchema
    
    class Meta:
        model = Answer
        fields = ['id', 'body', 'is_accepted', 'is_approved', 'created_at', 'votes']

class AnswerInSchema(Schema):
    body: str

class CommentOutSchema(ModelSchema):
    author: UserSchema

    class Meta:
        model = Comment
        fields = ['id', 'body', 'created_at']

class CommentInSchema(Schema):
    body: str
