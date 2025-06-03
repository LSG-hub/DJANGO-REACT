import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, MessageSquare, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Welcome from './Welcome';
import '../styles/ChatInterface.css';

const ChatInterface = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    try {
      setError(null);
      console.log('Loading chats...');
      const response = await api.get('/api/chats/');
      console.log('Chats loaded:', response.data);
      // Ensure we always set an array
      setChats(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error loading chats:', err);
      setError('Failed to load chats');
      setChats([]); // Ensure chats is always an array
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setError(null);
      console.log('Loading messages for chat:', chatId);
      const response = await api.get(`/api/chats/${chatId}/messages/`);
      console.log('Messages loaded:', response.data);
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
      setMessages([]);
    }
  };

  const createNewChat = async () => {
    try {
      setError(null);
      console.log('Creating new chat...');
      const response = await api.post('/api/chats/', {
        title: 'New Chat'
      });
      
      console.log('New chat created:', response.data);
      const newChat = response.data;
      
      // Update chats list
      setChats(prevChats => Array.isArray(prevChats) ? [newChat, ...prevChats] : [newChat]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Failed to create new chat');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    loadMessages(chat.id);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message:', inputMessage);
      const response = await api.post(`/api/chats/${currentChat.id}/send/`, {
        message: inputMessage
      });

      console.log('Message sent, response:', response.data);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        content: response.data.response || 'Sorry, I could not process your request.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Reload chats to update the sidebar
      loadChats();
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={createNewChat}>
            <Plus size={20} />
            New Chat
          </button>
        </div>
        
        <div className="chat-list">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <MessageSquare size={16} />
                <div className="chat-item-content">
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-preview">
                    {chat.last_message?.content?.substring(0, 50)}...
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#666',
              fontSize: '14px'
            }}>
              {error ? `Error: ${error}` : 'No chats yet. Start a new conversation!'}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <h2>{currentChat ? currentChat.title : 'Select a chat or start a new one'}</h2>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              margin: '16px 24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          {messages.length === 0 ? (
            <Welcome />
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <User size={20} />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.content}
                    {message.isStreaming && (
                      <span className="streaming-cursor">|</span>
                    )}
                  </div>
                  <div className="message-timestamp">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-form">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="message-input"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;