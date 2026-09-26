import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wallet, UserPlus, Phone, Lock, User } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobileNumber.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      setError('Please enter a valid mobile number (10-15 digits)');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    try {
      setSubmitting(true);
      await register(mobileNumber, password, confirmPassword, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Card className="glass-card auth-box border-0 text-light">
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}
          >
            <Wallet size={32} className="text-white" />
          </div>
          <h3 className="fw-bold brand-title mb-1">Create Account</h3>
          <p className="text-secondary small">Start splitting group expenses hassle-free</p>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Mobile Number *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="tel"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="form-control-custom ps-5"
                required
              />
              <Phone size={18} className="position-absolute text-secondary" style={{ left: '14px', top: '14px' }} />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Your Name (Optional)</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control-custom ps-5"
              />
              <User size={18} className="position-absolute text-secondary" style={{ left: '14px', top: '14px' }} />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control-custom ps-5"
                required
              />
              <Lock size={18} className="position-absolute text-secondary" style={{ left: '14px', top: '14px' }} />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label-custom">Confirm Password *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control-custom ps-5"
                required
              />
              <Lock size={18} className="position-absolute text-secondary" style={{ left: '14px', top: '14px' }} />
            </div>
          </Form.Group>

          <Button
            type="submit"
            disabled={submitting}
            className="btn-primary-gradient w-100 py-3 font-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            <UserPlus size={18} />
            <span>{submitting ? 'Registering...' : 'Register'}</span>
          </Button>

          <div className="text-center text-secondary small">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 fw-bold text-decoration-none" style={{ color: '#818cf8' }}>
              Sign In
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
