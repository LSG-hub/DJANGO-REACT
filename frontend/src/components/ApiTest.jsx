import { useState } from 'react';
import api from '../api';

const ApiTest = () => {
  const [status, setStatus] = useState('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test a simple GET request to the backend
      const response = await api.get('/api/chats/');
      setStatus(`✅ Connection successful! Status: ${response.status}`);
    } catch (error) {
      if (error.response) {
        setStatus(`❌ Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setStatus(`❌ Network error: Cannot connect to backend`);
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      fontSize: '12px',
      maxWidth: '250px'
    }}>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '5px'
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      <div style={{ fontSize: '11px', color: '#666' }}>
        Status: {status}
      </div>
    </div>
  );
};

export default ApiTest;