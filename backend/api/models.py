from django.db import models
from django.contrib.auth.models import User
import uuid


class Chat(models.Model):
    """
    Model representing a chat conversation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    title = models.CharField(max_length=255, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class Message(models.Model):
    """
    Model representing a message in a chat conversation.
    """
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.chat.title} - {self.role}: {self.content[:50]}..."


class UserProfile(models.Model):
    """
    Extended user profile for chat preferences.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    anthropic_model = models.CharField(
        max_length=50, 
        default='claude-3-5-sonnet-20241022',
        help_text="Preferred Anthropic model"
    )
    max_tokens = models.IntegerField(default=4000)
    temperature = models.FloatField(default=0.7)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"