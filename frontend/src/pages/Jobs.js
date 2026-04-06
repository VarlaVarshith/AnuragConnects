import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    location: '',
    jobType: ''
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    eligibility: '',
    jobType: 'full-time',
    salary: '',
    requirements: ''
  });

  const [applicationForm, setApplicationForm] = useState({
    resumeUrl: '',
    coverLetter: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs', { params: filters });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await axios.get('/api/jobs/my-applications');
      setMyApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...jobForm,
        requirements: jobForm.requirements.split('\n').filter(req => req.trim())
      };
      await axios.post('/api/jobs', jobData);
      setMessage('Job posted successfully!');
      setShowJobForm(false);
      setJobForm({
        title: '',
        description: '',
        company: '',
        location: '',
        eligibility: '',
        jobType: 'full-time',
        salary: '',
        requirements: ''
      });
      fetchJobs();
    } catch (error) {
      setMessage('Error posting job');
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/jobs/${selectedJob._id}/apply`, applicationForm);
      setMessage('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationForm({ resumeUrl: '', coverLetter: '' });
      setSelectedJob(null);
      fetchMyApplications();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting application');
    }
  };

  const applyForJob = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: '#007bff',
      reviewed: '#ffc107',
      shortlisted: '#28a745',
      rejected: '#dc3545',
      hired: '#28a745'
    };
    return colors[status] || '#6c757d';
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

  const jobsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem'
  };

  const jobCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Job Portal</h1>
        <button
          onClick={() => setShowJobForm(true)}
          className="btn btn-primary"
        >
          Post a Job
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div style={tabsStyle}>
        <button
          style={tabStyle(activeTab === 'browse')}
          onClick={() => setActiveTab('browse')}
        >
          Browse Jobs
        </button>
        <button
          style={tabStyle(activeTab === 'applications')}
          onClick={() => setActiveTab('applications')}
        >
          My Applications ({myApplications.length})
        </button>
      </div>

      {activeTab === 'browse' && (
        <>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Search jobs..."
                className="form-control"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <input
                type="text"
                placeholder="Company..."
                className="form-control"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location..."
                className="form-control"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
              <select
                className="form-control"
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
              <button onClick={fetchJobs} className="btn btn-primary">
                Search
              </button>
            </div>
          </div>

          <div style={jobsGridStyle}>
            {jobs.map(job => (
              <div
                key={job._id}
                style={jobCardStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{job.title}</h3>
                  <p style={{ color: '#007bff', fontWeight: '500', margin: '0.25rem 0' }}>
                    {job.company}
                  </p>
                  <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                    📍 {job.location} • {job.jobType.replace('-', ' ')}
                  </p>
                  {job.salary && (
                    <p style={{ color: '#28a745', fontWeight: '500', margin: '0.25rem 0' }}>
                      💰 {job.salary}
                    </p>
                  )}
                </div>

                <p style={{ color: '#6c757d', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {job.description.substring(0, 150)}...
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Eligibility:</strong>
                  <p style={{ color: '#6c757d', margin: '0.5rem 0' }}>{job.eligibility}</p>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Requirements:</strong>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} style={{ color: '#6c757d' }}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <small style={{ color: '#6c757d' }}>
                    Posted by {job.postedBy.name}
                  </small>
                  <button
                    onClick={() => applyForJob(job)}
                    className="btn btn-primary"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {jobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'applications' && (
        <div>
          {myApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
              <h3>No applications yet</h3>
              <p>Start applying to jobs to see your applications here</p>
            </div>
          ) : (
            <div style={jobsGridStyle}>
              {myApplications.map(application => (
                <div key={application._id} style={jobCardStyle}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{application.jobId.title}</h3>
                  <p style={{ color: '#007bff', fontWeight: '500', margin: '0.25rem 0' }}>
                    {application.jobId.company}
                  </p>
                  <p style={{ color: '#6c757d', margin: '0.25rem 0' }}>
                    📍 {application.jobId.location}
                  </p>
                  
                  <div style={{ margin: '1rem 0' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(application.status),
                        color: 'white'
                      }}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </p>

                  <div style={{ marginTop: '1rem' }}>
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem' }}
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Posting Modal */}
      {showJobForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Post a Job</h2>
              <button
                onClick={() => setShowJobForm(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleJobSubmit}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select
                  className="form-control"
                  value={jobForm.jobType}
                  onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Salary (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={jobForm.eligibility}
                  onChange={(e) => setJobForm({ ...jobForm, eligibility: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements (One per line)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="Bachelor's degree in Computer Science&#10;2+ years of experience&#10;Knowledge of React and Node.js"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  Post Job
                </button>
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationForm && selectedJob && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Apply for {selectedJob.title}</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4>{selectedJob.title}</h4>
              <p>{selectedJob.company} • {selectedJob.location}</p>
            </div>

            <form onSubmit={handleApplicationSubmit}>
              <div className="form-group">
                <label className="form-label">Resume URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={applicationForm.resumeUrl}
                  onChange={(e) => setApplicationForm({ ...applicationForm, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/your-resume"
                  required
                />
                <small style={{ color: '#6c757d' }}>
                  Upload your resume to Google Drive or similar service and paste the public link
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter (Optional)</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  placeholder="Write a brief cover letter explaining why you're interested in this position..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
