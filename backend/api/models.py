from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Interest(models.Model):
    name_tr = models.CharField(max_length=50, blank=False, null=False)
    name_en = models.CharField(max_length=50, blank=False, null=False)

    def __str__(self):
        return self.name_tr


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interests = models.ManyToManyField(Interest, blank=True)
    bio = models.CharField(max_length=250, null=False, blank=True, default="0")
    profilePhotoUrl = models.CharField(
        max_length=350, null=False, blank=True, default="")
    followers = models.ManyToManyField(
        User, related_name='takipciler', default=None, blank=True)
    following = models.ManyToManyField(
        User, related_name='takip_edilenler', default=None, blank=True)
    create = models.DateTimeField(auto_now=True, blank=True, null=True)
    edit = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return self.user.username


class Post(models.Model):
    profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, blank=False, null=False)
    text = models.CharField(max_length=180, blank=False, null=False)
    edit = models.DateTimeField(
        auto_now_add=True, blank=True, null=True)
    create = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.profile.user.username + ' | ' + self.text


class Filter(models.Model):
    text = models.CharField(max_length=24, null=False, blank=False)
    count = models.IntegerField(null=False, blank=True, default=1)
    edit = models.DateTimeField(
        auto_now_add=True, blank=True, null=True)
    create = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self) -> str:
        return self.text
