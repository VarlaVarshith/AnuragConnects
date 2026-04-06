import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxAttendees: '',
    eventType: 'other'
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'news') {
      fetchNews();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/events', {
        ...eventForm,
        maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : null
      });
      setMessage('Event created successfully!');
      setEventForm({
        title: '',
        description: '',
        date: '',
        location: '',
        maxAttendees: '',
        eventType: 'other'
      });
      fetchEvents();
    } catch (error) {
      setMessage('Error creating event');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/news', newsForm);
      setMessage('News article created successfully!');
      setNewsForm({
        title: '',
        content: '',
        category: 'general'
      });
      fetchNews();
    } catch (error) {
      setMessage('Error creating news article');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const tabsStyle = {
    display: 'flex',
    marginBottom: '2rem',
    borderBottom: '2px solid #eee'
  };

  const tabStyle = (isActive) => ({
    padding: '1rem 2rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    borderBottom: isActive ? '2px solid #007bff' : '2px solid transparent',
    color: isActive ? '#007bff' : '#6c757d'
  });

  const formSectionStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const listSectionStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const itemStyle = {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div style={tabsStyle}>
        <button
          style={tabStyle(activeTab === 'events')}
          onClick={() => setActiveTab('events')}
        >
          Events Management
        </button>
        <button
          style={tabStyle(activeTab === 'news')}
          onClick={() => setActiveTab('news')}
        >
          News Management
        </button>
      </div>

      {activeTab === 'events' && (
        <>
          <div style={formSectionStyle}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Event</h2>
            <form onSubmit={handleEventSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select
                    className="form-control"
                    value={eventForm.eventType}
                    onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
                  >
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="networking">Networking</option>
                    <option value="reunion">Reunion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Attendees (Optional)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={eventForm.maxAttendees}
                    onChange={(e) => setEventForm({ ...eventForm, maxAttendees: e.target.value })}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>

          <div style={listSectionStyle}>
            <h2 style={{ marginBottom: '1.5rem' }}>Existing Events</h2>
            {events.length === 0 ? (
              <p style={{ color: '#6c757d' }}>No events created yet.</p>
            ) : (
              events.map(event => (
                <div key={event._id} style={itemStyle}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{event.title}</h4>
                    <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                      📅 {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                    </p>
                    <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                      📍 {event.location}
                    </p>
                    <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                      👥 {event.attendees.length} attendees
                      {event.maxAttendees && ` (Max: ${event.maxAttendees})`}
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        backgroundColor: new Date(event.date) > new Date() ? '#28a745' : '#6c757d',
                        color: 'white'
                      }}
                    >
                      {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'news' && (
        <>
          <div style={formSectionStyle}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create News Article</h2>
            <form onSubmit={handleNewsSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Article Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  >
                    <option value="announcement">Announcement</option>
                    <option value="achievement">Achievement</option>
                    <option value="event">Event</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  rows="8"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Publishing...' : 'Publish Article'}
              </button>
            </form>
          </div>

          <div style={listSectionStyle}>
            <h2 style={{ marginBottom: '1.5rem' }}>Published Articles</h2>
            {news.length === 0 ? (
              <p style={{ color: '#6c757d' }}>No articles published yet.</p>
            ) : (
              news.map(article => (
                <div key={article._id} style={itemStyle}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{article.title}</h4>
                    <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                      📅 {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                      {article.content.substring(0, 100)}...
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        backgroundColor: '#007bff',
                        color: 'white'
                      }}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
