import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const TripCard = ({ trip }) => {
  return (
    <Card className="glass-card glass-card-interactive border-0 h-100 p-3">
      <Card.Body className="d-flex flex-column justify-content-between p-0">
        <div>
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 className="fw-bold mb-0 text-truncate text-main">{trip.name}</h5>
            <Badge className="px-2 py-1 rounded-pill fw-semibold" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
              {trip.currency || 'INR'}
            </Badge>
          </div>

          {trip.description && (
            <p className="text-muted-custom small mb-3 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {trip.description}
            </p>
          )}

          <div className="d-flex flex-column gap-2 my-3 py-2 border-top border-bottom theme-divider">
            <div className="d-flex justify-content-between align-items-center small">
              <span className="text-muted-custom d-flex align-items-center gap-1">
                <Users size={15} /> Members
              </span>
              <span className="fw-semibold text-main">{trip.memberCount || trip.members?.length || 0}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center small">
              <span className="text-muted-custom d-flex align-items-center gap-1">
                <Receipt size={15} /> Total Expenses
              </span>
              <span className="fw-bold fs-6 text-emerald-500" style={{ color: '#10b981' }}>
                {formatCurrency(trip.totalExpense || 0, trip.currency)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>
            <span>Created {formatDate(trip.createdAt)}</span>
            {trip.isOwner && (
              <span className="d-flex align-items-center gap-1 fw-medium" style={{ color: 'var(--link-color)' }}>
                <ShieldCheck size={13} /> Owner
              </span>
            )}
          </div>

          <Button
            as={Link}
            to={`/trips/${trip._id}`}
            className="btn-primary-gradient w-100 d-flex align-items-center justify-content-center gap-2 py-2"
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TripCard;
