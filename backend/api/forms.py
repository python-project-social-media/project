from django.forms import ModelForm
from . import models

class PostForm(ModelForm):

    class Meta:
        model=models.Post
        fields=["text"]

class ProfileForm(ModelForm):

    class Meta:
        model=models.Profile
        fields="__all__"