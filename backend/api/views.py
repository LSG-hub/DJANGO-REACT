# This file is part of the Django REST Framework API for user management.
# It defines a serializer for the User model to handle user creation and serialization.

from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    """
    View to create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to create an account

class NoteListView(generics.ListCreateAPIView):
    """
    View to list and create notes.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # Ensure only the user's notes are returned
    
    def perform_create(self, serializer):
        """
        Override to set the author of the note to the current user.
        """
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    """
    View to delete a note.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can delete notes

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)  # Ensure only the user's notes can be deleted