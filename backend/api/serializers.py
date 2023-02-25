from rest_framework import serializers
from . import models


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model=models.Interest
        fields="__all__"

class ProfileSerializer(serializers.ModelSerializer):

    interests = serializers.SerializerMethodField('get_interests')
    class Meta:
        model=models.Profile
        fields="__all__"

    def get_interests(self,profile):
        if profile.interests:
            interests = InterestSerializer(profile.interests,many=True)
            return interests.data
        else:
            return None


class PostSerializer(serializers.ModelSerializer):

    profile = serializers.SerializerMethodField('get_profile')
    class Meta:
        model=models.Post
        fields=['profile','text']

    def get_profile(self,post):
        if post.profile:
            profile = ProfileSerializer(post.profile,many=False)
            return profile.data
        else:
            return None