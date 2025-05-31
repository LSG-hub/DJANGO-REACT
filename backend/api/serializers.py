# This file is part of the Django REST Framework API for user management.
# It defines a serializer for the User model to handle user creation and serialization.

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'author', 'title', 'content', 'created_at']
        extra_kwargs = {
            'author': {'read_only': True}
        }