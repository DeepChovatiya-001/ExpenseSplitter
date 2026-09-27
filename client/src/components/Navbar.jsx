import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wallet, PlusCircle, LayoutDashboard, User, LogOut } from 'lucide-react';
import { getInitials } from '../utils/formatters';
import ThemeToggle from './ThemeToggle';

const AppNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center gap-2 brand-title fs-4 me-4 text-main">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 p-2 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}
          >
            <Wallet size={22} className="text-white" />
          </div>
          <span>Expense<span style={{ color: '#6366f1' }}>Splitter</span></span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-app-nav" />

        <Navbar.Collapse id="navbar-app-nav">
          <Nav className="me-auto gap-2 my-2 my-lg-0">
            <Nav.Link
              as={Link}
              to="/dashboard"
              active={location.pathname === '/dashboard'}
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
                location.pathname === '/dashboard' ? 'bg-indigo-600 text-white fw-semibold' : 'text-main'
              }`}
              style={{
                background: location.pathname === '/dashboard' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: location.pathname === '/dashboard' ? '#ffffff' : 'var(--text-main)'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/trips/create"
              active={location.pathname === '/trips/create'}
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
                location.pathname === '/trips/create' ? 'bg-indigo-600 text-white fw-semibold' : 'text-main'
              }`}
              style={{
                background: location.pathname === '/trips/create' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: location.pathname === '/trips/create' ? '#ffffff' : 'var(--text-main)'
              }}
            >
              <PlusCircle size={18} />
              <span>Create Trip</span>
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3">
            <ThemeToggle />

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="transparent"
                id="user-dropdown"
                className="d-flex align-items-center gap-2 border-0 p-1 text-main"
                style={{ background: 'none' }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
                >
                  {getInitials(user?.name)}
                </div>
                <div className="text-start d-none d-sm-block">
                  <div className="fw-semibold text-main small lh-1">{user?.name}</div>
                  <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>
                    📱 {user?.mobileNumber}
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="glass-card shadow-lg border-0 mt-2 p-2" style={{ minWidth: '180px' }}>
                <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2 py-2 rounded-2 text-main">
                  <User size={16} />
                  <span>My Profile</span>
                </Dropdown.Item>
                <Dropdown.Divider className="theme-divider" />
                <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 py-2 rounded-2 text-danger">
                  <LogOut size={16} />
                  <span>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
