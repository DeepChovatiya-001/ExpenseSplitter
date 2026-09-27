import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';
import { Phone, Calendar, LogOut, ArrowLeft } from 'lucide-react';
import { formatDate, getInitials } from '../utils/formatters';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />

      <Container className="mt-4" style={{ maxWidth: '600px' }}>
        <div className="mb-3">
          <Button
            as={Link}
            to="/dashboard"
            variant="link"
            className="text-muted-custom p-0 text-decoration-none d-flex align-items-center gap-1"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
        </div>

        <Card className="glass-card border-0 p-4 text-center">
          <div className="d-flex justify-content-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white fs-2 shadow-lg"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
              }}
            >
              {getInitials(user?.name)}
            </div>
          </div>

          <h3 className="fw-bold text-main mb-1">{user?.name}</h3>
          <p className="text-muted-custom small mb-4">Expense Splitter Member</p>

          <div
            className="p-3 rounded-3 text-start mb-4"
            style={{ background: 'var(--feature-card-bg)', border: '1px solid var(--feature-card-border)' }}
          >
            <div className="d-flex align-items-center gap-3 py-2 border-bottom theme-divider">
              <Phone size={20} style={{ color: '#6366f1' }} />
              <div>
                <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>Mobile Number</div>
                <div className="fw-semibold text-main">{user?.mobileNumber}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 py-2 border-bottom theme-divider">
              <Calendar size={20} style={{ color: '#6366f1' }} />
              <div>
                <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>Member Since</div>
                <div className="fw-semibold text-main">{formatDate(user?.createdAt)}</div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between py-2">
              <div className="text-muted-custom small fw-medium">Appearance Theme</div>
              <ThemeToggle showLabel={true} />
            </div>
          </div>

          <Button
            variant="outline-danger"
            onClick={handleLogout}
            className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </Button>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
