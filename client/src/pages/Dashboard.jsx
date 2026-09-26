import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle, Compass, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await tripService.getTrips();
      if (res.data.success) {
        setTrips(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />

      <Container className="mt-4">
        {/* Welcome Header */}
        <Card className="glass-card border-0 text-light p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 className="fw-bold brand-title mb-1">
                Welcome, <span style={{ color: '#818cf8' }}>{user?.name || 'Friend'}</span> 👋
              </h2>
              <p className="text-secondary mb-0">
                Track group expenses, calculate shares, and settle debts with minimum transactions.
              </p>
            </div>
            <Button
              as={Link}
              to="/trips/create"
              className="btn-primary-gradient d-flex align-items-center justify-content-center gap-2 py-2 px-4 shadow-lg flex-shrink-0"
            >
              <PlusCircle size={20} />
              <span>Create New Trip</span>
            </Button>
          </div>
        </Card>

        <Row className="g-4">
          {/* Main Trips Section */}
          <Col lg={8} xl={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-light mb-0 d-flex align-items-center gap-2">
                <Compass size={20} className="text-indigo-400" style={{ color: '#818cf8' }} />
                My Trips & Events ({trips.length})
              </h5>
              <Button
                variant="link"
                className="text-secondary p-0 text-decoration-none small d-flex align-items-center gap-1"
                onClick={fetchTrips}
              >
                <RefreshCw size={14} /> Refresh
              </Button>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {loading ? (
              <LoadingSpinner message="Fetching trips..." />
            ) : trips.length === 0 ? (
              <Card className="glass-card border-0 text-center text-light p-5 my-3">
                <div className="py-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle p-4 mb-3"
                    style={{ background: 'rgba(99, 102, 241, 0.1)' }}
                  >
                    <Compass size={48} className="text-indigo-400" style={{ color: '#818cf8' }} />
                  </div>
                  <h5 className="fw-bold text-light">No Trips Created Yet</h5>
                  <p className="text-secondary small max-w-400 mx-auto mb-4">
                    Create your first trip or event for vacations, parties, roommates, or college outings to start splitting expenses.
                  </p>
                  <Button
                    as={Link}
                    to="/trips/create"
                    className="btn-primary-gradient px-4 py-2"
                  >
                    + Create Your First Trip
                  </Button>
                </div>
              </Card>
            ) : (
              <Row className="g-3">
                {trips.map((trip) => (
                  <Col key={trip._id} md={6} xl={4}>
                    <TripCard trip={trip} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>

          {/* Quick Nav Sidebar */}
          <Col lg={4} xl={3}>
            <Sidebar trips={trips} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
