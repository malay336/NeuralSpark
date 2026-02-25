from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    """
    Custom User model extending Django's default AbstractUser.
    Adds a biography field and a reputation score to gamify learning and interactions.
    """
    bio = models.TextField(blank=True, null=True)
    reputation = models.IntegerField(default=0)

    def __str__(self):
        return self.username

class Tag(models.Model):
    """
    Tags used to categorize forum Questions for easier searching and filtering.
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    """
    High-level subjects (e.g., 'Data Structures', 'Operating Systems').
    Used to organize Lectures, PYQs, and Questions into specific subjects.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Lecture(models.Model):
    """
    Represents a video lecture module.
    Contains the video link (YouTube/Vimeo/Direct) and connects to a specific Category.
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_url = models.URLField(max_length=500)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='lectures')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class PYQ(models.Model):
    """
    Previous Year Question (PYQ) model.
    Stores the raw question text, an answer explanation, and an optional 
    video explanation URL for deeper learning.
    """
    year = models.IntegerField()
    subject = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='pyqs')
    question_text = models.TextField()
    answer_text = models.TextField(blank=True, null=True)
    video_url = models.URLField(max_length=500, blank=True, null=True, help_text="Optional explanation video")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PYQ {self.year} - {self.subject.name}"

class Product(models.Model):
    """
    Digital or physical products sold on the platform (e.g., 'GATE 2024 Mock Tests').
    Includes details, pricing, and external purchase links.
    """
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    purchase_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    """
    Services offered by the platform (e.g., '1-on-1 Mentorship', 'Resume Review').
    Users can inquire about these services through the frontend.
    """
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Optional base price")
    image_url = models.URLField(max_length=500, blank=True, null=True)
    contact_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    """
    Core model for the Community Q&A Forum.
    Students can post text-based questions or embed video explanations.
    Videos require manual moderator approval before public visibility.
    """
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='questions')
    title = models.CharField(max_length=255)
    body = models.TextField()
    video_url = models.URLField(max_length=500, blank=True, null=True, help_text="Optional YouTube or Vimeo link")
    is_video_approved = models.BooleanField(default=False, help_text="Checked by admin to approve video")
    tags = models.ManyToManyField(Tag, related_name='questions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Answer(models.Model):
    """
    Represents an answer to a specific community Question.
    Can be upvoted/downvoted by users, and requires admin moderation before public display.
    """
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    body = models.TextField()
    is_approved = models.BooleanField(default=False, help_text="Checked by admin to approve answer")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return f"Answer by {self.author.username} to '{self.question.title}'"

class Comment(models.Model):
    """
    A simple comment that can be attached to either a Question or an Answer.
    """
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Generic relations alternative (simple approach: bind to either Question or Answer)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')

    def __str__(self):
        return f"Comment by {self.author.username}"

class Inquiry(models.Model):
    """
    Stores contact form submissions from the Services page.
    Generates leads for mentorship and other premium service bookings.
    """
    name = models.CharField(max_length=255)
    email = models.EmailField()
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name} - {self.email}"
