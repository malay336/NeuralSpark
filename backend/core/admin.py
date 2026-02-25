from django.contrib import admin
from .models import User, Question, Answer, Comment, Tag, Category, Lecture, PYQ, Product, Service

admin.site.register(User)
admin.site.register(Tag)
admin.site.register(Category)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Comment)
admin.site.register(Lecture)
admin.site.register(PYQ)
admin.site.register(Product)
admin.site.register(Service)
