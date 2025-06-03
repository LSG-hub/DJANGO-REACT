from anthropic import Anthropic
from django.conf import settings
from typing import List, Dict, Generator
import json, os
import logging

logger = logging.getLogger(__name__)

class AnthropicService:
    def __init__(self):
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not set")
        self.client = Anthropic(api_key=api_key)

    def send_message(self, message_content):
        try:
            response = self.client.messages.create(
                model="claude-3-7-sonnet-latest",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": message_content
                    }
                ]
            )
            return response.content[0].text
        except Exception as e:
            print(f"Anthropic API Error: {e}")
            raise e
    
    def generate_chat_title(self, first_message: str) -> str:
        """Generate a title for the chat based on the first message"""
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",  # Using faster model for title generation
                max_tokens=20,
                temperature=0.3,
                messages=[{
                    "role": "user",
                    "content": f"Generate a short, descriptive title (max 5 words) for a conversation that starts with: '{first_message[:200]}'"
                }]
            )
            title = response.content[0].text.strip().strip('"').strip("'")
            return title[:50] if len(title) > 50 else title
        except Exception as e:
            logger.error(f"Error generating chat title: {e}")
            return "New Chat"
    
    # def send_message(self, messages: List[Dict], model: str = "claude-3-5-sonnet-20241022", 
    #                 max_tokens: int = 4000, temperature: float = 0.7) -> str:
    #     """Send a message to Anthropic API and get response"""
    #     try:
    #         response = self.client.messages.create(
    #             model=model,
    #             max_tokens=max_tokens,
    #             temperature=temperature,
    #             messages=messages
    #         )
    #         return response.content[0].text
    #     except anthropic.AuthenticationError:
    #         logger.error("Anthropic API authentication failed")
    #         raise Exception("Authentication failed. Please check your API key.")
    #     except anthropic.RateLimitError:
    #         logger.error("Anthropic API rate limit exceeded")
    #         raise Exception("Rate limit exceeded. Please try again later.")
    #     except anthropic.APIError as e:
    #         logger.error(f"Anthropic API error: {e}")
    #         raise Exception(f"API error: {str(e)}")
    #     except Exception as e:
    #         logger.error(f"Unexpected error: {e}")
    #         raise Exception(f"An unexpected error occurred: {str(e)}")
    
    def send_message_stream(self, messages: List[Dict], model: str = "claude-3-5-sonnet-20241022",
                           max_tokens: int = 4000, temperature: float = 0.7) -> Generator[str, None, None]:
        """Send a message to Anthropic API and stream the response"""
        try:
            stream = self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=messages,
                stream=True
            )
            
            for event in stream:
                if event.type == "content_block_delta":
                    if hasattr(event.delta, 'text'):
                        yield event.delta.text
                        
        except anthropic.AuthenticationError:
            logger.error("Anthropic API authentication failed")
            yield "ERROR: Authentication failed. Please check your API key."
        except anthropic.RateLimitError:
            logger.error("Anthropic API rate limit exceeded")
            yield "ERROR: Rate limit exceeded. Please try again later."
        except anthropic.APIError as e:
            logger.error(f"Anthropic API error: {e}")
            yield f"ERROR: API error: {str(e)}"
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            yield f"ERROR: An unexpected error occurred: {str(e)}"
    
    def format_messages_for_anthropic(self, messages) -> List[Dict]:
        """Format messages for Anthropic API"""
        formatted_messages = []
        for message in messages:
            if message.role != 'system':  # Anthropic handles system messages differently
                formatted_messages.append({
                    "role": message.role,
                    "content": message.content
                })
        return formatted_messages