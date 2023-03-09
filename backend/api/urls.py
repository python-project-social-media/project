from django.contrib import admin
from django.urls import path,include
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('', views.Routes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', views.Register),
    path('profile/add',views.AddProfile),
    path('post/add', views.AddPost),
    path('post/<int:id>', views.GetPost),
    path('post/<int:id>/delete', views.DeletePost),
    path('post/<int:id>/update', views.UpdatePost),
    path('profile/update', views.UpdateProfile),
    path('auth/', include('dj_rest_auth.urls')),
    path('rest-auth/google/', views.GoogleLogin.as_view()),
]
