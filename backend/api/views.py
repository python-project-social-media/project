from django.shortcuts import render,get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from . import models
from . import serializers
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_authenticated'] = user.is_authenticated
        token['is_superuser'] = user.is_superuser


        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def Routes(request):
    routes = [
        '/register/',
        '/login/',
        '/post/add',
        '/post/:id/',
        '/post/:id/update',
        '/post/:id/delete',
    ]

    return Response(routes)

#? POST CRUD
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AddPost(request):
    pass

@api_view(['GET'])
@permission_classes([AllowAny])
def GetPost(request,id):
    post = get_object_or_404(models.Post,id=id)
    data = serializers.PostSerializer(post,many=False)
    return Response(data.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UpdatePost(request,id):
    pass
