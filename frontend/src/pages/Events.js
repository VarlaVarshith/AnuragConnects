import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/register`);
      setMessage('Successfully registered for event!');
      fetchEvents(); // Refresh events
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering for event');
    }
  };

  const unregisterFromEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}/register`);
      setMessage('Successfully unregistered from event!');
      fetchEvents(); // Refresh events
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error unregistering from event');
    }
  };

  const isRegistered = (event) => {
    return event.attendees.some(attendee => attendee._id === user._id);
  };

  const isPastEvent = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const eventsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem'
  };

  const eventCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  const eventHeaderStyle = {
    borderBottom: '2px solid #007bff',
    paddingBottom: '1rem',
    marginBottom: '1rem'
  };

  const eventDateStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    display: 'inline-block',
    marginBottom: '1rem'
  };

  const attendeesStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '1rem 0',
    color: '#6c757d'
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '2rem' }}>Events</h1>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
          <h3>No events available</h3>
          <p>Check back later for upcoming events!</p>
        </div>
      ) : (
        <div style={eventsGridStyle}>
          {events.map(event => (
            <div
              key={event._id}
              style={eventCardStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={eventHeaderStyle}>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>{event.title}</h2>
                <div style={eventDateStyle}>
                  📅 {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📍</span>
                  <strong>{event.location}</strong>
                </p>
                <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👤</span>
                  Organized by {event.createdBy.name}
                </p>
              </div>

              <p style={{ color: '#6c757d', lineHeight: '1.6', marginBottom: '1rem' }}>
                {event.description}
              </p>

              <div style={attendeesStyle}>
                <span>👥</span>
                <span>{event.attendees.length} attendees</span>
                {event.maxAttendees && (
                  <span>• Max: {event.maxAttendees}</span>
                )}
              </div>

              {isPastEvent(event.date) ? (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  color: '#6c757d',
                  textAlign: 'center'
                }}>
                  This event has ended
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isRegistered(event) ? (
                    <button
                      onClick={() => unregisterFromEvent(event._id)}
                      className="btn btn-danger"
                      style={{ flex: 1 }}
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      onClick={() => registerForEvent(event._id)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={event.maxAttendees && event.attendees.length >= event.maxAttendees}
                    >
                      {event.maxAttendees && event.attendees.length >= event.maxAttendees 
                        ? 'Event Full' 
                        : 'Register'
                      }
                    </button>
                  )}
                </div>
              )}

              {isRegistered(event) && !isPastEvent(event.date) && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem', 
                  backgroundColor: '#d4edda', 
                  borderRadius: '4px',
                  color: '#155724',
                  textAlign: 'center'
                }}>
                  ✓ You are registered for this event
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
