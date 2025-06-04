import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';

const Message = ({ message, formatTimestamp }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="message-content">
        <div className="message-text">
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom component rendering
                h1: ({node, ...props}) => <h1 style={{fontSize: '1.5em', marginTop: '16px', marginBottom: '12px'}} {...props} />,
                h2: ({node, ...props}) => <h2 style={{fontSize: '1.3em', marginTop: '14px', marginBottom: '10px'}} {...props} />,
                h3: ({node, ...props}) => <h3 style={{fontSize: '1.1em', marginTop: '12px', marginBottom: '8px'}} {...props} />,
                p: ({node, ...props}) => <p style={{marginBottom: '12px', lineHeight: '1.6'}} {...props} />,
                ul: ({node, ...props}) => <ul style={{marginLeft: '20px', marginBottom: '12px'}} {...props} />,
                ol: ({node, ...props}) => <ol style={{marginLeft: '20px', marginBottom: '12px'}} {...props} />,
                li: ({node, ...props}) => <li style={{marginBottom: '4px'}} {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontSize: '0.9em'
                    }} {...props} />
                  ) : (
                    <code style={{
                      display: 'block',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '12px',
                      borderRadius: '6px',
                      overflowX: 'auto',
                      marginBottom: '12px'
                    }} {...props} />
                  ),
                blockquote: ({node, ...props}) => <blockquote style={{
                  borderLeft: '4px solid #e5e7eb',
                  paddingLeft: '16px',
                  marginLeft: '0',
                  marginBottom: '12px',
                  color: '#6b7280'
                }} {...props} />,
                a: ({node, ...props}) => <a style={{color: '#2563eb', textDecoration: 'underline'}} {...props} />,
                strong: ({node, ...props}) => <strong style={{fontWeight: '600'}} {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          {message.isStreaming && (
            <span className="streaming-cursor">|</span>
          )}
        </div>
        <div className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;