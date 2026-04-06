import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      announcement: '#007bff',
      achievement: '#28a745',
      event: '#ffc107',
      general: '#6c757d'
    };
    return colors[category] || colors.general;
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const newsItemStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const categoryBadgeStyle = (category) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: getCategoryColor(category),
    color: 'white',
    marginBottom: '1rem'
  });

  const newsHeaderStyle = {
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
    marginBottom: '1rem'
  };

  const newsTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
    color: '#333'
  };

  const newsMetaStyle = {
    color: '#6c757d',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const newsContentStyle = {
    lineHeight: '1.6',
    color: '#333',
    fontSize: '1rem'
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '2rem' }}>News & Updates</h1>

      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
          <h3>No news available</h3>
          <p>Check back later for updates!</p>
        </div>
      ) : (
        news.map(item => (
          <article key={item._id} style={newsItemStyle}>
            <div style={categoryBadgeStyle(item.category)}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </div>
            
            <div style={newsHeaderStyle}>
              <h2 style={newsTitleStyle}>{item.title}</h2>
              <div style={newsMetaStyle}>
                <span>👤 By {item.createdBy.name}</span>
                <span>📅 {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>

            <div style={newsContentStyle}>
              {item.content.split('\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '1rem' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))
      )}
    </div>
  );
};

export default News;
