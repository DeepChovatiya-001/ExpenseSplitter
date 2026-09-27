import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div className="min-vh-100 pb-5">
      <Navbar />

      <Container className="mt-5 text-center" style={{ maxWidth: '500px' }}>
        <Card className="glass-card border-0 p-5">
          <div className="d-inline-flex justify-content-center mb-3" style={{ color: '#6366f1' }}>
            <HelpCircle size={64} />
          </div>

          <h2 className="fw-bold brand-title mb-2 text-main">404 — Page Not Found</h2>
          <p className="text-muted-custom small mb-4">
            The page or trip you are looking for does not exist or has been moved.
          </p>

          <Button
            as={Link}
            to="/dashboard"
            className="btn-primary-gradient px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 mx-auto"
          >
            <Home size={18} />
            <span>Return to Dashboard</span>
          </Button>
        </Card>
      </Container>
    </div>
  );
};

export default NotFound;
