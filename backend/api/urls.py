from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('user/register/', views.CreateUserView.as_view(), name='register'),
    
    # Chat endpoints
    path('chats/', views.ChatListCreateView.as_view(), name='chat-list-create'),
    path('chats/<uuid:chat_id>/', views.ChatDetailView.as_view(), name='chat-detail'),
    path('chats/<uuid:chat_id>/messages/', views.MessageListCreateView.as_view(), name='message-list-create'),
    path('chats/<uuid:chat_id>/send/', views.SendMessageView.as_view(), name='send-message'),
    
    # User profile
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    
    # Debug endpoint
    path('debug-urls/', views.debug_urls, name='debug-urls'),
]