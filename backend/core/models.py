from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    reputation = models.IntegerField(default=0)

    def __str__(self):
        return self.username

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Lecture(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_url = models.URLField(max_length=500)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='lectures')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class PYQ(models.Model):
    year = models.IntegerField()
    subject = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='pyqs')
    question_text = models.TextField()
    answer_text = models.TextField(blank=True, null=True)
    video_url = models.URLField(max_length=500, blank=True, null=True, help_text="Optional explanation video")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PYQ {self.year} - {self.subject.name}"

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    purchase_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Optional base price")
    image_url = models.URLField(max_length=500, blank=True, null=True)
    contact_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Question(models.Model):
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
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Generic relations alternative (simple approach: bind to either Question or Answer)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True, related_name='comments')

    def __str__(self):
        return f"Comment by {self.author.username}"

class Inquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name} - {self.email}"
