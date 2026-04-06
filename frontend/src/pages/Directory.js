import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Directory = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    yearOfGraduation: '',
    currentCity: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.currentCompany && user.currentCompany.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    if (filters.yearOfGraduation) {
      filtered = filtered.filter(user => user.yearOfGraduation === parseInt(filters.yearOfGraduation));
    }

    if (filters.currentCity) {
      filtered = filtered.filter(user =>
        user.currentCity && user.currentCity.toLowerCase().includes(filters.currentCity.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const sendConnectionRequest = async (userId) => {
    try {
      await axios.post(`/api/connections/request/${userId}`);
      alert('Connection request sent!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending connection request');
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const filtersStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  };

  const userGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  const userCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer'
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

  const departments = [...new Set(users.map(user => user.department))];
  const graduationYears = [...new Set(users.map(user => user.yearOfGraduation))].sort((a, b) => b - a);

  if (loading) {
    return <div className="loading">Loading directory...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '2rem' }}>Alumni Directory</h1>

      <div style={filtersStyle}>
        <h3 style={{ marginBottom: '1rem' }}>Search & Filter</h3>
        <div style={filtersGridStyle}>
          <div className="form-group">
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search by name or company..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <select
              name="department"
              className="form-control"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="yearOfGraduation"
              className="form-control"
              value={filters.yearOfGraduation}
              onChange={handleFilterChange}
            >
              <option value="">All Years</option>
              {graduationYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="currentCity"
              className="form-control"
              placeholder="Filter by city..."
              value={filters.currentCity}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: '#6c757d' }}>
          Showing {filteredUsers.length} of {users.length} alumni
        </p>
      </div>

      <div style={userGridStyle}>
        {filteredUsers.map(user => (
          <div
            key={user._id}
            style={userCardStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={avatarStyle}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{user.name}</h3>
            <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
              {user.rollNo} • {user.department}
            </p>
            <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
              Class of {user.yearOfGraduation}
            </p>
            
            {user.currentCompany && (
              <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                🏢 {user.currentCompany}
              </p>
            )}
            
            {user.currentCity && (
              <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>
                📍 {user.currentCity}
              </p>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => sendConnectionRequest(user._id)}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                Connect
              </button>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
          <h3>No alumni found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Directory;
