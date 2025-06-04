import React from 'react';
import { Bot, MessageCircle, Zap, Shield } from 'lucide-react';
import '../styles/Welcome.css';

const Welcome = ({ onSampleQuestionClick }) => {
  const features = [
    {
      icon: <MessageCircle size={24} />,
      title: "Natural Conversations",
      description: "Chat naturally with Claude, powered by Anthropic's latest AI technology"
    },
    {
      icon: <Zap size={24} />,
      title: "Real-time Responses",
      description: "Get instant, streaming responses as Claude thinks and responds"
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description: "Your conversations are encrypted and stored securely"
    }
  ];

  const sampleQuestions = [
    "What is machine learning?",
    "Write a Python function to sort a list",
    "Explain quantum computing in simple terms",
    "Help me plan a workout routine",
    "What are the benefits of meditation?"
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* Hero Section */}
        <div className="welcome-hero">
          <div className="hero-icon">
            <Bot size={64} />
          </div>
          <h1 className="hero-title">Welcome to ChatBot</h1>
          <p className="hero-subtitle">
            Start a conversation with Claude, your AI assistant powered by Anthropic
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Sample Questions */}
        <div className="sample-questions">
          <h3 className="questions-title">Try asking something like:</h3>
          <div className="questions-grid">
            {sampleQuestions.map((question, index) => (
              <div 
                key={index} 
                className="question-card"
                onClick={() => onSampleQuestionClick && onSampleQuestionClick(question)}
              >
                "{question}"
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="welcome-cta">
          <p className="cta-text">Ready to start? Type a message below to begin your conversation!</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;