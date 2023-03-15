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
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage

load_dotenv()

#? Neo4j Database
class App:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def serialize_post(self,result):
        post_data = result.get('post')
        profile = get_object_or_404(models.Profile,id=post_data['profile_id'])
        post_data['profile'] = serializers.ProfileSerializer(profile,many=False).data
        post_data['edit'] = datetime.datetime.fromtimestamp( post_data.get('edit')/1000 )  
        post_data['create'] = datetime.datetime.fromtimestamp( post_data.get('create')/1000 ) 
        return post_data

    def serialize_news(self,result):
        post_data = result.get('news')
        profile = get_object_or_404(models.Profile,id=post_data['profile_id'])
        post_data['profile'] = serializers.ProfileSerializer(profile,many=False).data
        post_data['edit'] = datetime.datetime.fromtimestamp( post_data.get('edit')/1000 )  
        post_data['create'] = datetime.datetime.fromtimestamp( post_data.get('create')/1000 ) 
        return post_data


    #!Add profile
    def add_profile_helper(self, tx,username, profile_id):
        query = (
            "CREATE (profile:Profile {profile_id:$profile_id, username:$username}) RETURN profile"
        )
        result = tx.run(query, username=username, profile_id=profile_id)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
        
    def add_profile(self, profile_id, username):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self.add_profile_helper, username, profile_id)
            return result


    #!Add post
    def add_post_helper(self, tx, file, text, profile_id):
        query = (
            "MATCH (profile:Profile {profile_id:$profile_id}) CREATE (post:Post {text:$text, file:$file, profile_id:$profile_id, create:TIMESTAMP(), edit:TIMESTAMP()}) CREATE (profile) -[:Posted]-> (post) RETURN post"
        )
        result = tx.run(query, text=text, profile_id=profile_id,file=file)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
        
    def add_post(self, file, text, profile_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self.add_post_helper, file, text, profile_id)
            output = self.serialize_post(result[0])
            return output

    #!Delete post
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

    #!Get post
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
            output = self.serialize_post(result[0])
            return output

    #!Update post
    def update_post_helper(self,tx,file, id,text,delete):
        query = (
            "MATCH (post:Post) "
            "WHERE ID(post)=$id "
            "SET post.text = $text "
            "SET post.update = TIMESTAMP() "
            "SET post.file = $file "
            "RETURN post"
        )
        result = tx.run(query,id=id,text=text,delete=delete,file=file)
        try:
            return ([row.data()
                for row in result])
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
            query=query, exception=exception))
            raise

    def update_post(self,id,file,text,delete):
        if text!=None:
            with self.driver.session(database="neo4j") as session:
                result = session.execute_write(
                self.update_post_helper,id=id,text=text,delete=delete,file=file)
                output = self.serialize_post(result[0])
                return output
        else:
            print("no data given")

    #!Filter post by text
    def filter_post_text_helper(self,tx,text):
        query = (
            "MATCH (post:Post) "+ "WHERE post.text CONTAINS '"+text +"' RETURN post"
        )
        result = tx.run(query,text=text)
        
        try:
            return ([row.data()
                for row in result])
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
            query=query, exception=exception))
            raise

    def filter_post_text(self,text):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self.filter_post_text_helper,text)
            arr=[]
            for i in result:
                arr.append(self.serialize_post(i))
            return arr


    #!Add a news
    def add_news_helper(self, tx, image, profile_id, description, title):
        query = (
            "MATCH (profile:Profile {profile_id:$profile_id}) CREATE (news:News {title:$title,description:$description, image:$image, profile_id:$profile_id, create:TIMESTAMP(), edit:TIMESTAMP()}) CREATE (profile) -[:Published]-> (news) RETURN news"
        )
        result = tx.run(query, description=description, profile_id=profile_id,images=image,title=title)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
        
    def add_news(self, image, profile_id, description, title):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self.add_news_helper, image, profile_id, description, title)
            output = (self.serialize_news(result[0]))
            return output

    #!Get a news
    def get_news_helper(self, tx, id):
        query = (
            "MATCH (news:News) WHERE ID(news)=$id RETURN news"
        )
        result = tx.run(query, id=id)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
      
    def get_news(self, id):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self.get_news_helper, id)
            if len(result)==0:
                return "E"
            output = (self.serialize_news(result[0]))
            return output

    #!Delete a news  
    def delete_news_helper(self, tx, id):
        query = (
            "MATCH (news:News) WHERE ID(news)=$id DETACH DELETE news"
        )
        result = tx.run(query, id=id)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
        
    def delete_news(self, id):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self.delete_news_helper, id)
            return result

    #!Update a news  
    def update_news_helper(self, tx, image, id, title, description,delete):
        if delete==True:
            query=(
                "MATCH (news:News) "
                "WHERE ID(news)=$id "
                "SET news.edit=TIMESTAMP() "
                "SET news.title=$title "
                "SET news.description=$description "
                "SET news.image='' "
                "RETURN news"
            )
        else:
            query = (
                "MATCH (news:News) "
                "WHERE ID(news)=$id "
                "SET news.edit=TIMESTAMP() "
                "SET news.title=$title "
                "SET news.description=$description "
                "SET news.image=$image "
                "RETURN news"
            )
        result = tx.run(query, id=id,title=title,description=description,image=image,delete=delete)
        
        try:
                return ([row.data()
                    for row in result])
        except ServiceUnavailable as exception:
                logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
                raise
        
    def update_news(self, image, id, title, description,delete):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self.update_news_helper,image,id,title,description,delete)
            output = self.serialize_news(result[0])
            return output

    
#? Inıtalizing the database
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
        '/rest-auth/google/',
        '/auth/login',
        '/auth/logout',
        '/auth/user',
        '/auth/password/change',
        '/auth/password/reset',
        '/auth/password/reset/confirm',
        '/register',
        '/login/',
        '/profile/:id',
        '/profile/add',
        '/profile/update',
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
                profile = formprofile.save()
                app.add_profile(profile.id,profile.user.username)
                return Response({"msg_en":"Successfully registered. ✨","msg_tr":"Başarıyla kayıt olundu. ✨"},status=200)
            else:
                user.delete()
                return Response({"msg_en":"An error occured. 🤔","msg_tr":"Bir hata oluştu. 🤔"},status=400)
        else:
            
            return Response({"msg_en":"Data is not valid. 🤨","msg_tr":"Veri doğru değil. 🤨"},status=400)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)



#! POST CRUD
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def AddPost(request):
    if request.data:
        profile = models.Profile.objects.filter(user=request.user)
        if len(profile)>0:
            profile=profile[0]
        else:
            return Response({"msg_en":"Couldnt find the profile. 🥲","msg_tr":"Profil bulunamadı. 🥲"},status=400)
        upload = request.FILES.get('upload')
        fss = FileSystemStorage()
        file = fss.save("posts"+"/"+upload.name, upload)
        file_url = fss.url(file)
        post_data = (app.add_post(file=file_url,text=request.data.get('text'),profile_id=profile.id))
        app.close()
        return Response({"data":post_data},status=200)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def GetPost(request,id):
    result = app.get_post(id=id)
    app.close()
    if result=="E":
        return Response({"msg_tr":"Gönderi bulunamadı. 😒","msg_en":"Post not fonund. 😒"},status=400)
    return Response({"msg_en":"Got the post successfully. ✨","msg_tr":"Gönderi başarıyla alındı. ✨","data":result},status=200)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def DeletePost(request,id):
    post = app.get_post(id=id)
    if post=="E":
        return Response({"msg_tr":"Gönderi bulunamadı. 😒","msg_en":"Post not fonund. 😒"},status=400)
    if request.user.id==post.get('profile').get('user').get('id'):
        result = app.delete_post(id=id)
        app.close()
        return Response({"msg_en":"Successfully deleted the post. 👽","msg_tr":"Gönderi başarıyla silindi. 👽"},status=200)
    else:
        return Response({"msg_en":"Users dont match. 😒","msg_tr":"Kullanıcı uyuşmuyor. 😒"},status=400)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def UpdatePost(request,id):
    post = app.get_post(id=id)
    if post=="E":
        return Response({"msg_tr":"Gönderi bulunamadı. 😒","msg_en":"Post not fonund. 😒"},status=400)
    if request.user.id==post.get('profile').get('user').get('id'):
        if request.data:
            if request.data.get('delete')=='true':
                post_data = app.update_post(id=id,file='',text=request.data.get('text'),delete=True)
            else:
                upload = request.FILES.get('upload')
                if upload!=None:
                    fss = FileSystemStorage()
                    file = fss.save("posts"+"/"+upload.name, upload)
                    file_url = fss.url(file)
                    post_data = app.update_post(id=id,file=file_url,text=request.data.get('text'),delete=False)
                else:
                    post_data = app.update_post(id=id,file='',text=request.data.get('text'),delete=False)
            return Response({"msg_en":"Successfully updated the post. 🚀","msg_tr":"Gönderi başarıyla güncellendi. 🚀","data":post_data},status=200)
        else:
            return Response({"msg_en":"There is no data to update. 😒","msg_tr":"Güncelleyecek veri vermediniz. 😒"},status=400)
    else:
        return Response({"msg_en":"Users dont match. 😒","msg_tr":"Kullanıcı uyuşmuyor. 😒"},status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def FilterPostText(request):
    post = app.filter_post_text(text=request.GET.get('text'))
    return Response({"msg_en":"There is no data to update. 😒","msg_tr":"Güncelleyecek veri vermediniz. 😒"},status=200)



#! PROFILE CRUD
@api_view(['POST']) 
def GoogleAddOrGetProfile(request,id):
    if request.data:
        user = User.objects.get(id = request.data.get('user'))
        profile = models.Profile.objects.filter(user=user)
        if len(profile)>0:
            serializer = serializers.ProfileSerializer(profile[0],many=False)
            return Response({"data":serializer.data},status=200)
        form = forms.ProfileForm(request.data)
        if form.is_valid():
            profile = form.save()
            app.add_profile(username=profile.user.username,profile_id=profile.id)
            app.close()
            serializer = serializers.ProfileSerializer(profile,many=False)
            return Response({"data":serializer.data},status=200)
        else:
            return Response({"msg_en":"Data is not valid. 😥","msg_tr":"Veri doğru değil. 😥"},status=400)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

@api_view(['POST']) 
def AddProfile(request):
    if request.data:
        user = User.objects.get(id = request.data.get('user'))
        profile = models.Profile.objects.filter(user=user)
        if len(profile)>0:
            serializer = serializers.ProfileSerializer(profile[0],many=False)
            return Response(jwt.encode(serializer.data, "secret", algorithm="HS256"),status=200)
        form = forms.ProfileForm(request.data)
        if form.is_valid():
            profile = form.save()
            serializer = serializers.ProfileSerializer(profile,many=False)
            return Response(jwt.encode(serializer.data, "secret", algorithm="HS256"),status=200)
        else:
            return Response({"msg_en":"Data is not valid. 😥","msg_tr":"Veri doğru değil. 😥"},status=400)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

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

@api_view(['GET'])
@permission_classes([AllowAny])
def GetProfile(request,id):
    profile = models.Profile.objects.filter(user=User.objects.get(id=id))
    if len(profile)>0:
        data = serializers.ProfileSerializer(profile[0],many=False)
        return Response({"data":data.data},status=200)
    else:
        return Response({"msg_en":"Couldnt find the profile. 🥲","msg_tr":"Profil bulunamadı. 🥲"},status=400)



#! NEWS CRUD
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def AddNews(request):
    profile = models.Profile.objects.filter(user=request.user)
    if len(profile)>0:
        profile=profile[0]
    else:
        return Response({"msg_en":"Couldnt find the profile. 🥲","msg_tr":"Profil bulunamadı. 🥲"},status=400)
    if request.data:
        upload = request.FILES.get('upload')
        fss = FileSystemStorage()
        file = fss.save("news"+"/"+upload.name, upload)
        file_url = fss.url(file)
        result = app.add_news(file_url,profile.id,request.data.get('description'),request.data.get('title'))
        return Response({"msg_en":"Successfully added news. 🚀","msg_tr":"Haber başarıyla eklendi. 🚀","data":result},status=200)
    else:
        return Response({"msg_en":"There was no data entered. 😒","msg_tr":"Bize veri verilmedi. 😒"},status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def GetNews(request,id):
    result = app.get_news(id)
    if result=="E":
        return Response({"msg_en":"Couldnt find the news. 😶","msg_tr":"Haber bulunamadı. 😶"},status=400)
    return Response({"data":result},status=200)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def DeleteNews(request,id):
    result = app.get_news(id)
    if result!="E":
        if result.get('profile').get('user').get('id')!=request.user.id:
            return Response({"msg_tr":"Bunu silmek için yetkiniz yok. 😥","msg_en":"You are not allowed to delete this news. 😥"},status=400)
        else:
            result = app.delete_news(id)
            return Response({"msg_en":"Successfully deleted the news. ✨","msg_tr":"Haber başarıyla silindi. ✨"},status=200)
    else:
        return Response({"msg_en":"Couldnt find the news. 😶","msg_tr":"Haber bulunamadı. 😶"},status=400)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def UpdateNews(request,id):
    result = app.get_news(id)
    if result!="E":
        if result.get('profile').get('user').get('id')!=request.user.id:
            return Response({"msg_tr":"Bunu güncellemek için yetkiniz yok. 😥","msg_en":"You are not allowed to update this news. 😥"},status=400)
        else:
            if request.data:
                if request.data.get('delete')=='true':
                    result = app.update_news('',id,request.data.get('title'),request.data.get('description'),True)
                else:
                    upload = request.FILES.get('upload')
                    if upload!=None:
                        fss = FileSystemStorage()
                        file = fss.save("news"+"/"+upload.name, upload)
                        file_url = fss.url(file)
                        print("FOTOTOTOTOTO",file_url)
                        result = app.update_news(file_url,id,request.data.get('title'),request.data.get('description'),False)
                    else:
                        result = app.update_news('',id,request.data.get('title'),request.data.get('description'),False)
                
                return Response({"msg_en":"Successfully updated the news. ✨","msg_tr":"Haber başarıyla güncellendi. ✨","data":result},status=200)
            else:
                return Response({"msg_en":"No data was given. 🫥","msg_tr":"Bize veri verilmedi. 🫥"},status=400)
    else:
        return Response({"msg_en":"Couldnt find the news. 😶","msg_tr":"Haber bulunamadı. 😶"},status=400)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173/login"
    client_class = OAuth2Client