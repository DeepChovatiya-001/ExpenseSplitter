import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wallet, LogIn, Phone, Lock, Eye, EyeOff, Sparkles, Zap, ShieldCheck, PieChart } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleFillDemo = (demoMobile, demoPass) => {
    setMobileNumber(demoMobile);
    setPassword(demoPass);
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
                      <Sparkles size={12} className="me-1 inline-block" /> Smart Group Expenses
                    </span>
                  </div>
                </div>

                <h2 className="fw-extrabold mb-3 text-main display-6" style={{ letterSpacing: '-0.03em' }}>
                  Split Expenses, <br />
                  <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Zero Stress.
                  </span>
                </h2>

                <p className="text-muted-custom lead fs-6 mb-4">
                  Effortlessly track group trips, split dining bills, and calculate optimized minimal settlements in seconds.
                </p>

                {/* Feature Highlights */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="feature-pill d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-indigo-400" style={{ background: 'rgba(79, 70, 229, 0.15)' }}>
                      <Zap size={20} style={{ color: '#6366f1' }} />
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-0 text-main small">Instant Settlement Engine</h6>
                      <span className="text-muted-custom micro-text" style={{ fontSize: '0.78rem' }}>Minimizes payments between trip members automatically</span>
                    </div>
                  </div>

                  <div className="feature-pill d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-cyan-400" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                      <PieChart size={20} style={{ color: '#06b6d4' }} />
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-0 text-main small">Real-time Balance Dashboard</h6>
                      <span className="text-muted-custom micro-text" style={{ fontSize: '0.78rem' }}>Know exactly who owes what at any point</span>
                    </div>
                  </div>

                  <div className="feature-pill d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-emerald-400" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                      <ShieldCheck size={20} style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-0 text-main small">Simple & Secure Mobile Sign-In</h6>
                      <span className="text-muted-custom micro-text" style={{ fontSize: '0.78rem' }}>Fast access without complex passwords</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Activity Card */}
              <div className="p-3 rounded-4 glass-card border-0 mt-2" style={{ background: 'var(--feature-card-bg)', border: '1px solid var(--feature-card-border)' }}>
                <div className="d-flex justify-content-between align-items-center small text-muted-custom mb-1">
                  <span>🏖️ Goa Trip Recent Activity</span>
                  <span className="badge bg-emerald-500 bg-opacity-20 text-emerald-400 px-2 py-1 rounded-pill" style={{ color: '#10b981' }}>Settled</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold text-main small">Rahul paid ₹3,200 for Dinner</span>
                  <span className="fw-bold text-indigo-400" style={{ color: '#6366f1' }}>₹800/person</span>
                </div>
              </div>
            </Col>

            {/* Right Auth Form */}
            <Col lg={6} className="auth-form-section d-flex flex-column justify-content-between">
              {/* Top Header with Theme Switcher */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-muted-custom small fw-medium">Welcome back</span>
                <ThemeToggle showLabel={true} />
              </div>

              <div>
                <h3 className="fw-bold text-main mb-1 fs-4">Sign In to Your Account</h3>
                <p className="text-muted-custom small mb-4">Enter your registered mobile number to continue</p>

                <ErrorMessage message={error} onClose={() => setError('')} />

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3 position-relative">
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
                      <Phone size={18} className="input-icon-left" />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3 position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label className="form-label-custom mb-0">Password</Form.Label>
                    </div>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
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

                  {/* Demo fill suggestions */}
                  <div className="mb-4 d-flex align-items-center gap-2 flex-wrap">
                    <span className="micro-text text-muted-custom" style={{ fontSize: '0.78rem' }}>Quick Test:</span>
                    <button
                      type="button"
                      className="demo-chip"
                      onClick={() => handleFillDemo('9876543210', 'password123')}
                    >
                      <Sparkles size={13} /> Demo Account (9876543210)
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-gradient w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-4"
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        <span>Sign In</span>
                      </>
                    )}
                  </Button>
                </Form>
              </div>

              {/* Bottom Footer */}
              <div className="text-center pt-3 border-top theme-divider">
                <p className="text-muted-custom small mb-0">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="fw-bold text-link text-decoration-none">
                    Create One Here
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

export default Login;
