from django.contrib import admin
from django.urls import path,include
from . import views
urlpatterns = [
    path('', views.Routes),
    path('post/<int:id>', views.GetPost),
    path('post/add', views.AddPost),
]
