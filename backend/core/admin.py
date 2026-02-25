from django.contrib import admin
from .models import User, Question, Answer, Comment, Tag, Category, Lecture, PYQ, Product, Service, Inquiry

admin.site.site_header = 'NeuralSpark Administration'
admin.site.site_title = 'NeuralSpark Admin Portal'
admin.site.index_title = 'Welcome to the NeuralSpark Platform'

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'reputation', 'is_staff')
    search_fields = ('username', 'email')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'is_video_approved', 'created_at')
    list_filter = ('is_video_approved', 'category')
    search_fields = ('title', 'body', 'author__username')
    filter_horizontal = ('tags',)

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question', 'author', 'is_accepted', 'is_approved', 'created_at')
    list_filter = ('is_accepted', 'is_approved')
    search_fields = ('body', 'author__username')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'created_at')
    search_fields = ('body', 'author__username')

@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'order', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'description')
    ordering = ('category', 'order')

@admin.register(PYQ)
class PYQAdmin(admin.ModelAdmin):
    list_display = ('year', 'subject', 'created_at')
    list_filter = ('year', 'subject')
    search_fields = ('question_text',)
    ordering = ('-year',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'service', 'created_at')
    list_filter = ('service',)
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
