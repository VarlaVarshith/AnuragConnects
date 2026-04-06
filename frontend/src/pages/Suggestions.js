import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Suggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSuggestions();
    fetchConnections();
    fetchConnectionRequests();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('/api/suggestions');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await axios.get('/api/connections');
      setConnections(response.data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await axios.get('/api/connections/requests');
      setConnectionRequests(response.data);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    }
  };

  const sendConnectionRequest = async (userId) => {
    try {
      await axios.post(`/api/connections/request/${userId}`);
      setMessage('Connection request sent!');
      // Remove from suggestions
      setSuggestions(suggestions.filter(s => s._id !== userId));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending connection request');
    }
  };

  const handleConnectionRequest = async (requestId, status) => {
    try {
      await axios.put(`/api/connections/request/${requestId}`, { status });
      setMessage(`Connection request ${status}!`);
      fetchConnectionRequests();
      fetchConnections();
    } catch (error) {
      setMessage('Error handling connection request');
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #007bff'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  const cardStyle = {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const avatarStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  };

  const reasonBadgeStyle = {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginBottom: '1rem',
    display: 'inline-block'
  };

  if (loading) {
    return <div className="loading">Loading suggestions...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '2rem' }}>Networking & Connections</h1>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {/* Connection Requests */}
      {connectionRequests.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Pending Connection Requests</h2>
          <div style={gridStyle}>
            {connectionRequests.map(request => (
              <div
                key={request._id}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={avatarStyle}>
                  {request.userId.name.charAt(0).toUpperCase()}
                </div>
                
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{request.userId.name}</h3>
                <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                  {request.userId.department} • Class of {request.userId.yearOfGraduation}
                </p>
                {request.userId.currentCompany && (
                  <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                    🏢 {request.userId.currentCompany}
                  </p>
                )}
                {request.userId.currentCity && (
                  <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>
                    📍 {request.userId.currentCity}
                  </p>
                )}

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleConnectionRequest(request._id, 'accepted')}
                    className="btn btn-success"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleConnectionRequest(request._id, 'declined')}
                    className="btn btn-danger"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Suggested Connections</h2>
        <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
          Based on your profile, here are some alumni you might want to connect with:
        </p>

        {suggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            <h3>No suggestions available</h3>
            <p>We'll show you relevant connections as more alumni join the platform!</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {suggestions.map(suggestion => (
              <div
                key={suggestion._id}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={reasonBadgeStyle}>
                  {suggestion.reason}
                </div>
                
                <div style={avatarStyle}>
                  {suggestion.name.charAt(0).toUpperCase()}
                </div>
                
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{suggestion.name}</h3>
                <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                  {suggestion.rollNo} • {suggestion.department}
                </p>
                <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                  Class of {suggestion.yearOfGraduation}
                </p>
                
                {suggestion.currentCompany && (
                  <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                    🏢 {suggestion.currentCompany}
                  </p>
                )}
                
                {suggestion.currentCity && (
                  <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>
                    📍 {suggestion.currentCity}
                  </p>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => sendConnectionRequest(suggestion._id)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Connections */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Your Connections ({connections.length})</h2>
        
        {connections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            <h3>No connections yet</h3>
            <p>Start connecting with fellow alumni to build your network!</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {connections.map(connection => (
              <div key={connection._id} style={cardStyle}>
                <div style={avatarStyle}>
                  {connection.name.charAt(0).toUpperCase()}
                </div>
                
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{connection.name}</h3>
                <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                  {connection.department} • Class of {connection.yearOfGraduation}
                </p>
                
                {connection.currentCompany && (
                  <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                    🏢 {connection.currentCompany}
                  </p>
                )}
                
                {connection.currentCity && (
                  <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>
                    📍 {connection.currentCity}
                  </p>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.8rem' }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
