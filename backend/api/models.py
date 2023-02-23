from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    bio = models.CharField(max_length=250,blank=False,null=True,default="0")
    profilePhoto = models.ImageField(upload_to="profilePhotos",null=False,blank=False,default="default.png")
    crate = models.DateTimeField(auto_now=True,blank=True, null=True)

    def __str__(self):
        return self.user.username


class Post(models.Model):
    profile  = models.ForeignKey(Profile,on_delete=models.CASCADE,blank=False,null=False)
    text = models.CharField(max_length=180,blank=False,null=False)
    edit = models.DateTimeField(
        auto_now_add=True, blank=True, null=True)
    create = models.DateTimeField(auto_now=True,blank=True, null=True)

    def __str__(self):
        return self.profile.user.username + ' | ' + self.text