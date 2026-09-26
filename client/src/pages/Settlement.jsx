import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { tripService } from '../services/api';
import Navbar from '../components/Navbar';
import BalanceCard from '../components/BalanceCard';
import SettlementList from '../components/SettlementList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ArrowLeft, Calculator, ShieldCheck, RefreshCw } from 'lucide-react';

const Settlement = () => {
  const { id: tripId } = useParams();
  const [settlementData, setSettlementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSettlement = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await tripService.getSettlement(tripId);
      if (res.data.success) {
        setSettlementData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settlement details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlement();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-vh-100 pb-5">
        <Navbar />
        <LoadingSpinner message="Calculating optimal debt settlements..." />
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />

      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            as={Link}
            to={`/trips/${tripId}`}
            variant="link"
            className="text-secondary p-0 text-decoration-none d-flex align-items-center gap-1"
          >
            <ArrowLeft size={18} /> Back to Trip Details
          </Button>

          <Button
            variant="link"
            className="text-secondary p-0 text-decoration-none small d-flex align-items-center gap-1"
            onClick={fetchSettlement}
          >
            <RefreshCw size={14} /> Recalculate
          </Button>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {/* Title Banner */}
        <Card className="glass-card border-0 text-light p-4 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)' }}
            >
              <Calculator size={32} className="text-white" />
            </div>
            <div>
              <h2 className="fw-bold brand-title mb-1">
                Settlement Plan — {settlementData?.tripName}
              </h2>
              <p className="text-secondary small mb-0">
                Minimum transaction debt settlement algorithm output
              </p>
            </div>
          </div>
        </Card>

        {settlementData && (
          <Row className="g-4">
            <Col lg={5}>
              <BalanceCard
                balances={settlementData.balances}
                currency={settlementData.currency}
              />
            </Col>
            <Col lg={7}>
              <SettlementList
                settlement={settlementData}
                currency={settlementData.currency}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Settlement;
