from django.contrib import admin
from .models import User, Question, Answer, Comment, Tag, Category, Lecture, PYQ, Product, Service, Inquiry, Quiz, QuizQuestion, QuizOption, Article

# Customizing global headers and titles for NeuralSpark Admin CMS
admin.site.site_header = 'NeuralSpark CMS & Administration'
admin.site.site_title = 'NeuralSpark Admin Portal'
admin.site.index_title = 'Manage Platform Content, Questions, Lectures & Articles'

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'reputation', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name', 'description')

@admin.register(PYQ)
class PYQAdmin(admin.ModelAdmin):
    """
    Comprehensive Content Management for Practice Questions & PYQs.
    Allows editing question text, formatting, Options A/B/C/D, Correct Option, Solution text, and metadata.
    """
    list_display = ('id', 'question_preview', 'subject', 'year', 'is_pyq', 'correct_option', 'created_at')
    list_filter = ('subject', 'is_pyq', 'year', 'correct_option')
    search_fields = ('question_text', 'answer_text', 'option_a', 'option_b', 'option_c', 'option_d')
    list_editable = ('subject', 'year', 'is_pyq')
    ordering = ('-id',)
    
    fieldsets = (
        ('Subject & Classification', {
            'fields': ('subject', 'is_pyq', 'year')
        }),
        ('Question Statement (Supports Math & Markdown)', {
            'fields': ('question_text',)
        }),
        ('Multiple Choice Options (MCQ)', {
            'fields': (('option_a', 'option_b'), ('option_c', 'option_d'), 'correct_option'),
            'description': 'Enter Option A, B, C, D text and select the correct option letter (A, B, C, or D).'
        }),
        ('Solution & Walkthrough', {
            'fields': ('answer_text', 'video_url')
        }),
    )

    def question_preview(self, obj):
        text = obj.question_text or ""
        return text[:80] + ("..." if len(text) > 80 else "")
    question_preview.short_description = "Question Statement"

class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 4

class QuizQuestionInline(admin.StackedInline):
    model = QuizQuestion
    extra = 1

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'quiz', 'question_text', 'created_at')
    list_filter = ('quiz__category', 'quiz')
    search_fields = ('question_text', 'explanation')
    inlines = [QuizOptionInline]

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'description')
    inlines = [QuizQuestionInline]

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'subject', 'created_at')
    list_filter = ('subject',)
    search_fields = ('title', 'summary', 'content')
    fieldsets = (
        ('Article Overview', {
            'fields': ('title', 'subject', 'summary')
        }),
        ('Markdown Content', {
            'fields': ('content',),
            'description': 'Write theory article content in Markdown format.'
        })
    )

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'order', 'video_url', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'description')
    ordering = ('category', 'order')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'category', 'is_video_approved', 'created_at')
    list_filter = ('is_video_approved', 'category')
    search_fields = ('title', 'body', 'author__username')
    filter_horizontal = ('tags',)

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'author', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('body', 'author__username')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'created_at')
    search_fields = ('body', 'author__username')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'service', 'created_at')
    list_filter = ('service',)
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
