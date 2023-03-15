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
    path('profile/<int:id>/google',views.GoogleAddOrGetProfile),
    path('profile/add',views.AddProfile),
    path('profile/update', views.UpdateProfile),
    
    #TODO Post
    path('post/add', views.AddPost),
    path('post/<int:id>', views.GetPost),
    path('post/<int:id>/delete', views.DeletePost),
    path('post/<int:id>/update', views.UpdatePost),
    path('post/filter', views.FilterPostText),

    #TODO News
    path('news/<int:id>', views.GetNews),
    path('news/add', views.AddNews),
    path('news/<int:id>/delete', views.DeleteNews),
    path('news/<int:id>/update', views.UpdateNews),
]
