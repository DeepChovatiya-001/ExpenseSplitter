import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wallet, UserPlus, Phone, Lock, User, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="auth-page-container">
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-orb-container">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <div className="auth-split-wrapper">
        <Card className="glass-card auth-card-main border-0 shadow-2xl">
          <Row className="g-0">
            {/* Left Hero & Feature Showcase */}
            <Col lg={6} className="auth-hero-section">
              <div>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-4 p-3 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}
                  >
                    <Wallet size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="fw-bold brand-title mb-0 fs-3">Expense<span style={{ color: '#6366f1' }}>Splitter</span></h3>
                    <span className="badge rounded-pill bg-indigo-500 bg-opacity-20 text-indigo-300 px-3 py-1 mt-1 small" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
                      <Sparkles size={12} className="me-1 inline-block" /> Quick Registration
                    </span>
                  </div>
                </div>

                <h2 className="fw-extrabold mb-3 text-main display-6" style={{ letterSpacing: '-0.03em' }}>
                  Join ExpenseSplitter <br />
                  <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    In Seconds.
                  </span>
                </h2>

                <p className="text-muted-custom lead fs-6 mb-4">
                  Create your free account today and start organizing group trip expenses without awkward money math.
                </p>

                {/* Feature List */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="feature-pill d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-indigo-400" style={{ background: 'rgba(79, 70, 229, 0.15)' }}>
                      <Users size={20} style={{ color: '#6366f1' }} />
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-0 text-main small">Create Unlimited Trips</h6>
                      <span className="text-muted-custom micro-text" style={{ fontSize: '0.78rem' }}>Add friends and manage shared expenses seamlessly</span>
                    </div>
                  </div>

                  <div className="feature-pill d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-cyan-400" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                      <CheckCircle2 size={20} style={{ color: '#06b6d4' }} />
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-0 text-main small">Fair Equal & Custom Splits</h6>
                      <span className="text-muted-custom micro-text" style={{ fontSize: '0.78rem' }}>Flexible split options for every purchase</span>
                    </div>
                  </div>

                  <div className="feature-pill d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-emerald-400" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                      <ShieldCheck size={20} style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-0 text-main small">Private & Reliable</h6>
                      <span className="text-muted-custom micro-text" style={{ fontSize: '0.78rem' }}>Your expense history is synced safely across devices</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-4 glass-card border-0 mt-2" style={{ background: 'var(--feature-card-bg)', border: '1px solid var(--feature-card-border)' }}>
                <div className="d-flex align-items-center gap-2 text-indigo-400 mb-1 small fw-semibold">
                  <Sparkles size={16} /> <span>100% Free to Use</span>
                </div>
                <span className="text-muted-custom small">No hidden fees, no credit card required. Simple phone login!</span>
              </div>
            </Col>

            {/* Right Form Section */}
            <Col lg={6} className="auth-form-section d-flex flex-column justify-content-between">
              {/* Header with Theme Switcher */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-muted-custom small fw-medium">Create New Account</span>
                <ThemeToggle showLabel={true} />
              </div>

              <div>
                <h3 className="fw-bold text-main mb-1 fs-4">Get Started Now</h3>
                <p className="text-muted-custom small mb-4">Fill out the details below to set up your account</p>

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
                      <Phone size={18} className="input-icon-left" />
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
                      <User size={18} className="input-icon-left" />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Password *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control-custom ps-5 pe-5"
                        required
                      />
                      <Lock size={18} className="input-icon-left" />
                      <button
                        type="button"
                        className="input-action-right"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">Confirm Password *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control-custom ps-5 pe-5"
                        required
                      />
                      <Lock size={18} className="input-icon-left" />
                      <button
                        type="button"
                        className="input-action-right"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-gradient w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Create Account</span>
                      </>
                    )}
                  </Button>
                </Form>
              </div>

              {/* Bottom Link */}
              <div className="text-center pt-3 border-top theme-divider">
                <p className="text-muted-custom small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-bold text-link text-decoration-none">
                    Sign In Here
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Register;
