import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    currentCity: '',
    currentCompany: '',
    bio: '',
    skills: []
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        currentCity: user.currentCity || '',
        currentCompany: user.currentCompany || '',
        bio: user.bio || '',
        skills: user.skills || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfile({
      ...profile,
      skills
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/users/profile', profile);
      setMessage('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const profileHeaderStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    textAlign: 'center'
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem auto'
  };

  const profileInfoStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #eee'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333'
  };

  const valueStyle = {
    color: '#6c757d'
  };

  const skillsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  };

  const skillBadgeStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem'
  };

  return (
    <div style={containerStyle}>
      <div style={profileHeaderStyle}>
        <div style={avatarStyle}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1>{user.name}</h1>
        <p style={{ color: '#6c757d', margin: '0.5rem 0' }}>
          {user.rollNo} • {user.department} • Class of {user.yearOfGraduation}
        </p>
        <p style={{ color: '#6c757d' }}>
          {user.collegeEmail}
        </p>
      </div>

      <div style={profileInfoStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Profile Information</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-primary"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current City</label>
              <input
                type="text"
                name="currentCity"
                className="form-control"
                value={profile.currentCity}
                onChange={handleChange}
                placeholder="e.g., Hyderabad"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Company</label>
              <input
                type="text"
                name="currentCompany"
                className="form-control"
                value={profile.currentCompany}
                onChange={handleChange}
                placeholder="e.g., Google"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                className="form-control"
                value={profile.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skills</label>
              <input
                type="text"
                className="form-control"
                value={profile.skills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="e.g., JavaScript, React, Node.js (comma separated)"
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        ) : (
          <div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Current City:</span>
              <span style={valueStyle}>{profile.currentCity || 'Not specified'}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Current Company:</span>
              <span style={valueStyle}>{profile.currentCompany || 'Not specified'}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Bio:</span>
              <span style={valueStyle}>{profile.bio || 'No bio available'}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Skills:</span>
              <div style={skillsStyle}>
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} style={skillBadgeStyle}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={valueStyle}>No skills listed</span>
                )}
              </div>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Member Since:</span>
              <span style={valueStyle}>
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
