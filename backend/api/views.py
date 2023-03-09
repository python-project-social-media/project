from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from . import models,forms,serializers
from django.contrib.auth.forms import UserCreationForm
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
import jwt
from django.conf import settings
from neo4j import GraphDatabase
import logging
from neo4j.exceptions import ServiceUnavailable
from dotenv import load_dotenv
import os 

load_dotenv()

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        # Don't forget to close the driver connection when you are finished with it
        self.driver.close()

    def add_post(self,tx, text, profile_id):
        # To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
        # The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
        query = (
            "CREATE (post:Post { text: $text,profile_id:$profile_id,create:TIMESTAMP(),edit:TIMESTAMP()}) "
            "RETURN post"
        )
        result = tx.run(query, text=text, profile_id=profile_id)
    
        try:
            print(result)
            return [{"data": row["p1"]["name"], "p2": row["p2"]["name"]}
                    for row in result]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def get_post(self, id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self.get_post, id)
            for row in result:
                print("Found person: {row}".format(row=row))

    def delete_post(self,tx,id):
        query = (
            "MATCH (post:Post)"
            "WHERE post.id = $id"
            "DETACH DELETE post"
        )
        result = tx.run(query, id=id)
    
        try:
            print(result)
            return ["mesi"]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def filter_post_by_text(tx,text):
        query = (
            "MATCH (post:Post) "
            "WHERE post.text CONTAINS WITH '$text'"
            "RETURN p.name AS name"
        )
        result = tx.run(query, text=text)
        print(result)
        return [row["name"] for row in result]

    def update_post(self,tx,id,text=None):
        if text!=None:
            query = (
            "MATCH (post:Post)"
            "WHERE post.id=$id"
            "SET post.text = $text"
            "SET post.update = TIMESTAMP()"
            "RETURN post"
            )
            result = tx.run(query, id=id)
    
            try:
                print(result)
                return ["mesi"]
            # Capture any errors along with the query and data for traceability
            except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                    query=query, exception=exception))
                raise
        else:
            print("no data given")

    def add_profile(self,tx,user_id,username):
        query = (
            "CREATE (post:Profile { user: $user_id,username:$username,create:TIMESTAMP(),edit:TIMESTAMP()}) "
            "RETURN post"
        )
        result = tx.run(query, user_id=user_id, username=username)
    
        try:
            print(result)
            return [{"data": row["p1"]["name"], "p2": row["p2"]["name"]}
                    for row in result]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

   
app = App(os.getenv('URI'),os.getenv('USER'),os.getenv('PASSWORD'))



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
    app.create_friendship("SUAREZ","NEYMAR")
    app.close()
    return Response(routes)

@api_view(['POST']) 
def Register(request):
    form = UserCreationForm()
    if request.data:
        form = UserCreationForm(request.data)
        if form.is_valid():
            user = form.save()
            data = {"user":user}
            formprofile = forms.ProfileForm(data)
            if formprofile.is_valid():
                formprofile.save()
                return Response({"msg_en":"Successfully registered. ✨","msg_tr":"Başarıyla kayıt olundu. ✨"},status=200)
            else:
                user.delete()
                return Response({"msg_en":"An error occured. 🤔","msg_tr":"Bir hata oluştu. 🤔"},status=400)
        else:
            
            return Response({"msg_en":"Data is not valid. 🤨","msg_tr":"Veri doğru değil. 🤨"},status=400)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

@api_view(['POST']) 
def AddProfile(request):
    if request.data:
        form = forms.ProfileForm(request.data)
        if form.is_valid():
            profile = form.save()
            serializer = serializers.ProfileSerializer(profile,many=False)
            return Response(jwt.encode(serializer.data, "secret", algorithm="HS256"),status=200)
        else:
            return Response({"msg_en":"Data is not valid. 😥","msg_tr":"Veri doğru değil. 😥"},status=400)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)
    

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
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

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

@api_view(['PUT'])    
@permission_classes([IsAuthenticated])
def UpdateProfile(request):
    profile = get_object_or_404(models.Profile, id=request.user.id)
    if request.data:
        if request.data.get('bio'):
            profile.bio = request.data.get('bio')
        if 'profilePhoto' in request.FILES:
            profile.profilePhoto = request.FILES['profilePhoto']
        profile.save()
        data = serializers.ProfileSerializer(profile,many=False)
        return Response({"msg_en":"Successfully updated profile. 🚀","msg_tr":"Profil başarıyla güncellendi. 🚀","data":data.data},status=200)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)
    

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173/login"
    client_class = OAuth2Client