import { useState, useEffect } from 'react';
import { testConnection, getCurrentUser } from '../utils/apiHelpers';

/**
 * Example component showing how to use the API
 * You can use this as a reference or delete it
 */
export default function ApiTest() {
  const [testResult, setTestResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      setUserData(user);
    } catch (err) {
      setError(err.message || 'Failed to fetch user (you may not be authenticated)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>API Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testApiConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button 
          onClick={fetchUser}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Get User
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          Error: {error}
        </div>
      )}

      {testResult && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <strong>✅ Connection Test Result:</strong>
          <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {userData && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderRadius: '5px'
        }}>
          <strong>👤 User Data:</strong>
          <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
