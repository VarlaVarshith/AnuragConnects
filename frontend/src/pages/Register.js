import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    rollNo: '',
    collegeEmail: '',
    personalEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate roll number format
    const rollNoPattern = /^\d{2}[a-z]{2}\d{3}[a-z]\d{2}$/;
    if (!rollNoPattern.test(formData.rollNo)) {
      setError('Invalid roll number format. Use format: YYdeptSEQSectionNo (e.g., 22eg105p33)');
      setLoading(false);
      return;
    }

    // Validate college email format
    const expectedEmail = `${formData.rollNo}@anurag.edu.in`;
    if (formData.collegeEmail !== expectedEmail) {
      setError(`College email must be ${expectedEmail}`);
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setTempToken(result.data.tempToken);
      setStep(2);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifyOTP(otp, tempToken);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px'
  };

  if (step === 1) {
    return (
      <div style={containerStyle}>
        <div style={formStyle}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register</h2>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleStep1Submit}>
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                name="rollNo"
                className="form-control"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g., 22eg105p33"
                required
              />
              <small style={{ color: '#6c757d' }}>
                Format: YYdeptSEQSectionNo (YY=year, dept=department, SEQ=sequence, Section=letter, No=number)
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">College Email</label>
              <input
                type="email"
                name="collegeEmail"
                className="form-control"
                value={formData.collegeEmail}
                onChange={handleChange}
                placeholder="22eg105p33@anurag.edu.in"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                className="form-control"
                value={formData.personalEmail}
                onChange={handleChange}
                placeholder="your.email@gmail.com"
                required
              />
              <small style={{ color: '#6c757d' }}>
                OTP will be sent to this email
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Verify OTP</h2>
        
        <div className="alert alert-info">
          An OTP has been sent to your personal email: {formData.personalEmail}
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleStep2Submit}>
          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button 
            onClick={() => setStep(1)}
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
          >
            Back to registration
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
