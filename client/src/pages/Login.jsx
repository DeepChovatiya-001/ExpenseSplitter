import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wallet, LogIn, Phone, Lock } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobileNumber.trim() || !password) {
      setError('Please fill in both mobile number and password');
      return;
    }

    try {
      setSubmitting(true);
      await login(mobileNumber, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <h3 className="fw-bold brand-title mb-1">Expense Splitter</h3>
          <p className="text-secondary small">Welcome back! Sign in to manage group expenses</p>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Mobile Number</Form.Label>
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

          <Form.Group className="mb-4">
            <Form.Label className="form-label-custom">Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <LogIn size={18} />
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          </Button>

          <div className="text-center text-secondary small">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 fw-bold text-decoration-none" style={{ color: '#818cf8' }}>
              Register Here
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
