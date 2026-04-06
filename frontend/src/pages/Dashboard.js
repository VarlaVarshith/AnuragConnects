import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAlumni: 0,
    upcomingEvents: 0,
    activeJobs: 0,
    connections: 0
  });
  const [recentNews, setRecentNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, newsRes, eventsRes, connectionsRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/news'),
        axios.get('/api/events'),
        axios.get('/api/connections')
      ]);

      setStats({
        totalAlumni: usersRes.data.length,
        upcomingEvents: eventsRes.data.filter(event => new Date(event.date) > new Date()).length,
        activeJobs: 0, // Will be updated when jobs are loaded
        connections: connectionsRes.data.length
      });

      setRecentNews(newsRes.data.slice(0, 3));
      setUpcomingEvents(eventsRes.data.filter(event => new Date(event.date) > new Date()).slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const welcomeStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '0.5rem 0'
  };

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #007bff'
  };

  const newsItemStyle = {
    padding: '1rem 0',
    borderBottom: '1px solid #eee'
  };

  const eventItemStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    marginBottom: '1rem'
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={welcomeStyle}>
        <h1>Welcome back, {user.name}!</h1>
        <p style={{ color: '#6c757d', margin: '0.5rem 0 0 0' }}>
          {user.department} • Class of {user.yearOfGraduation} • {user.currentCity || 'Location not set'}
        </p>
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <h3>Total Alumni</h3>
          <div style={statNumberStyle}>{stats.totalAlumni}</div>
          <Link to="/directory" style={{ color: '#007bff', textDecoration: 'none' }}>
            View Directory
          </Link>
        </div>
        
        <div style={statCardStyle}>
          <h3>Upcoming Events</h3>
          <div style={statNumberStyle}>{stats.upcomingEvents}</div>
          <Link to="/events" style={{ color: '#007bff', textDecoration: 'none' }}>
            View Events
          </Link>
        </div>
        
        <div style={statCardStyle}>
          <h3>Your Connections</h3>
          <div style={statNumberStyle}>{stats.connections}</div>
          <Link to="/suggestions" style={{ color: '#007bff', textDecoration: 'none' }}>
            Find More
          </Link>
        </div>
        
        <div style={statCardStyle}>
          <h3>Job Opportunities</h3>
          <div style={statNumberStyle}>New</div>
          <Link to="/jobs" style={{ color: '#007bff', textDecoration: 'none' }}>
            Browse Jobs
          </Link>
        </div>
      </div>

      <div style={contentGridStyle}>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Recent News</h2>
          {recentNews.length > 0 ? (
            recentNews.map(news => (
              <div key={news._id} style={newsItemStyle}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{news.title}</h4>
                <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
                  {news.content.substring(0, 100)}...
                </p>
                <small style={{ color: '#6c757d' }}>
                  By {news.createdBy.name} • {new Date(news.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p style={{ color: '#6c757d' }}>No recent news available.</p>
          )}
          <Link to="/news" style={{ color: '#007bff', textDecoration: 'none' }}>
            View All News →
          </Link>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div key={event._id} style={eventItemStyle}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{event.title}</h4>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  📍 {event.location}
                </p>
                <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
                  {event.attendees.length} attendees
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: '#6c757d' }}>No upcoming events.</p>
          )}
          <Link to="/events" style={{ color: '#007bff', textDecoration: 'none' }}>
            View All Events →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
