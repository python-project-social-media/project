from django.shortcuts import render,get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from . import models,forms,serializers

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
        '/post/:id',
        '/post/:id/update',
        '/post/:id/delete',
    ]

    return Response(routes)

#? POST CRUD
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def AddPost(request):
    form = forms.PostForm()
    if request.data:
        form = forms.PostForm(request.data)
        if form.is_valid():
            post = form.save()
            serializer=serializers.PostSerializer(post,many=False)
            return Response(serializer.data,status=200)
        else:
            return Response({"msg_en":"Data is not valid. 😥","msg_tr":"Veri doğru değil. 😥"},status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def GetPost(request,id):
    post = get_object_or_404(models.Post,id=id)
    data = serializers.PostSerializer(post,many=False)
    return Response({"msg_tr":"Got the post successfully. ✨","msg_en":"Gönderi başarıyla alındı. ✨","data":data.data},status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeletePost(request,id):
    post = models.Post.objects.get(id=id)
    if request.user.id==post.profile.user.id:
        post.delete()
        return Response({"msg_en":"Successfully deleted the post. 👽","msg_tr":"Gönderi başarıyla silindi. 👽"},status=200)
    else:
        return Response({"msg_en":"Users dont match. 😒","msg_tr":"Kullanıcı uyuşmuyor. 😒"},status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdatePost(request,id):
    post = get_object_or_404(models.Post,id=id)
    if request.user.id==post.profile.user.id:
        if request.data:
            if request.data.get('text'):
                post.text = request.data.get('text')
                post.save()
            post=serializers.PostSerializer(post,many=False)
            return Response({"msg_en":"Successfully updated the post. 🚀","msg_tr":"Gönderi başarıyla güncellendi. 🚀","data":post.data},status=200)
        else:
            return Response({"msg_en":"There is no data to update. 😒","msg_tr":"Güncelleyecek veri vermediniz. 😒"},status=400)
    else:
        return Response({"msg_en":"Users dont match. 😒","msg_tr":"Kullanıcı uyuşmuyor. 😒"},status=400)