from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Chat, Message, UserProfile
from .serializers import UserSerializer, ChatSerializer, MessageSerializer
from django.http import JsonResponse
from django.urls import get_resolver


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'chat_id'

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        return Message.objects.filter(
            chat__id=chat_id,
            chat__user=self.request.user
        ).order_by('timestamp')  # Changed from 'created_at' to 'timestamp'


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id):
        try:
            # Get the chat
            chat = Chat.objects.get(id=chat_id, user=request.user)
            
            # Get message content
            message_content = request.data.get('message', '')
            
            if not message_content.strip():
                return Response(
                    {'error': 'Message content is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Save user message
            user_message = Message.objects.create(
                chat=chat,
                content=message_content,
                role='user'
            )

            # Get AI response using Anthropic
            try:
                from .services.anthropic_service import AnthropicService
                anthropic_service = AnthropicService()
                ai_response = anthropic_service.send_message(message_content)
            except Exception as e:
                print(f"Anthropic API error: {e}")
                ai_response = "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again later."
            
            # Save AI message
            ai_message = Message.objects.create(
                chat=chat,
                content=ai_response,
                role='assistant'
            )

            # Update chat title if it's the first exchange
            if chat.messages.count() == 2:  # user + AI message
                title = message_content[:50]
                if len(message_content) > 50:
                    title += "..."
                chat.title = title
                chat.save()

            return Response({
                'response': ai_response,
                'user_message_id': user_message.id,
                'ai_message_id': ai_message.id
            })

        except Chat.DoesNotExist:
            return Response(
                {'error': 'Chat not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Server error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


def debug_urls(request):
    """Debug view to see what URLs are available"""
    resolver = get_resolver()
    url_patterns = []
    
    def extract_patterns(patterns, prefix=''):
        for pattern in patterns:
            if hasattr(pattern, 'url_patterns'):
                extract_patterns(pattern.url_patterns, prefix + str(pattern.pattern))
            else:
                url_patterns.append(prefix + str(pattern.pattern))
    
    extract_patterns(resolver.url_patterns)
    return JsonResponse({'available_urls': url_patterns})