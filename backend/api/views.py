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
import time
import datetime
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes

load_dotenv()

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        # Don't forget to close the driver connection when you are finished with it
        self.driver.close()

    def serialize_post(self,result):
        post_data = result[0].get('post')
        profile = get_object_or_404(models.Profile,id=post_data['profile_id'])
        post_data['profile'] = serializers.ProfileSerializer(profile,many=False).data
        post_data['edit'] = datetime.datetime.fromtimestamp( post_data.get('edit')/1000 )  
        post_data['create'] = datetime.datetime.fromtimestamp( post_data.get('create')/1000 ) 
        return post_data

    def add_post_helper(self, tx, text, profile_id):
        query = (
            "CREATE (post:Post { text: $text,profile_id:$profile_id,create:TIMESTAMP(),edit:TIMESTAMP()}) "
            "RETURN post, ID(post)"
        )
        result = tx.run(query, text=text, profile_id=profile_id)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
        
    def add_post(self, text, profile_id):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self.add_post_helper, text, profile_id)
            output = self.serialize_post(result)
            return output


    def delete_post_helper(self, tx, id):
        query = (
            "MATCH (post:Post) "
            "WHERE ID(post)=$id "
            "DETACH DELETE post"
        )
        result = tx.run(query, id=id)
        
        try:
            return ([row.data()
                for row in result])
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
            query=query, exception=exception))
            raise

    def delete_post(self, id):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self.delete_post_helper, id)
            return result


    def get_post_helper(self, tx, id):
        query = (
            "MATCH (post:Post) "
            "WHERE ID(post)=$id "
            "RETURN post"
        )
        result = tx.run(query,id=id)
        
        try:
            return ([row.data()
                for row in result])
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
            query=query, exception=exception))
            raise

    def get_post(self, id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self.get_post_helper,id=id)
            if result==[]:
                return "E"
            output = self.serialize_post(result)
            return output

    
    def filter_post_by_text(tx,text):
        query = (
            "MATCH (post:Post) "
            "WHERE post.text CONTAINS WITH '$text'"
            "RETURN p.name AS name"
        )
        result = tx.run(query, text=text)
        print(result)
        return [row["name"] for row in result]

    def update_post_helper(self,tx,id,text):
        query = (
            "MATCH (post:Post) "
            "WHERE ID(post)=$id "
            "SET post.text = $text "
            "SET post.update = TIMESTAMP() "
            "RETURN post"
        )
        result = tx.run(query,id=id,text=text)
        try:
            print(result,"typo")
            return ([row.data()
                for row in result])
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
            query=query, exception=exception))
            raise

    def update_post(self,id,text):
        if text!=None:
            with self.driver.session(database="neo4j") as session:
                result = session.execute_write(
                self.update_post_helper,id=id,text=text)
                output = self.serialize_post(result)
                return output
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
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def AddPost(request):
    if request.data:
        profile = get_object_or_404(models.Profile,user=request.user)
        post_data = (app.add_post(text=request.data.get('text'),profile_id=profile.id))
        app.close()
        return Response({"data":post_data},status=200)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def GetPost(request,id):
    result = app.get_post(id=id)
    if result=="E":
        return Response({"msg_tr":"Gönderi bulunamadı. 😒","msg_en":"Post not fonund. 😒"},status=400)
    return Response({"msg_en":"Got the post successfully. ✨","msg_tr":"Gönderi başarıyla alındı. ✨","data":result},status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeletePost(request,id):
    post = app.get_post(id=id)
    if result=="E":
        return Response({"msg_tr":"Gönderi bulunamadı. 😒","msg_en":"Post not fonund. 😒"},status=400)
    if request.user.id==post.get('profile').get('user').get('id'):
        result = app.delete_post(id=id)
        app.close()
        return Response({"msg_en":"Successfully deleted the post. 👽","msg_tr":"Gönderi başarıyla silindi. 👽"},status=200)
    else:
        return Response({"msg_en":"Users dont match. 😒","msg_tr":"Kullanıcı uyuşmuyor. 😒"},status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdatePost(request,id):
    post = app.get_post(id=id)
    if post=="E":
        return Response({"msg_tr":"Gönderi bulunamadı. 😒","msg_en":"Post not fonund. 😒"},status=400)
    if request.user.id==post.get('profile').get('user').get('id'):
        if request.data:
            post_data = app.update_post(id=id,text=request.data.get('text'))
            return Response({"msg_en":"Successfully updated the post. 🚀","msg_tr":"Gönderi başarıyla güncellendi. 🚀","data":post_data},status=200)
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