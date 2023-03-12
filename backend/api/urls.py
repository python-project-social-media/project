from django.contrib import admin
from django.urls import path,include
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('', views.Routes),

    #TODO Auth
    path('rest-auth/google/', views.GoogleLogin.as_view()),
    path('auth/', include('dj_rest_auth.urls')),
    path('register', views.Register),

    #TODO Profile
    path('profile/<int:id>',views.GetProfile),
    path('profile/add',views.AddProfile),
    path('profile/update', views.UpdateProfile),
    
    #TODO Post
    path('post/add', views.AddPost),
    path('post/<int:id>', views.GetPost),
    path('post/<int:id>/delete', views.DeletePost),
    path('post/<int:id>/update', views.UpdatePost),
]
