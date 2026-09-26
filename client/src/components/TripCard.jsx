import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Users, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const TripCard = ({ trip }) => {
  return (
    <Card className="glass-card glass-card-interactive border-0 h-100 text-light p-3">
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 className="fw-bold mb-0 text-truncate text-light">{trip.name}</h5>
            <Badge bg="indigo" className="bg-indigo-500 text-indigo-100 px-2 py-1 rounded-pill" style={{ backgroundColor: '#4f46e5' }}>
              {trip.currency || 'INR'}
            </Badge>
          </div>

          {trip.description && (
            <p className="text-secondary small mb-3 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {trip.description}
            </p>
          )}

          <div className="d-flex flex-column gap-2 my-3 py-2 border-top border-bottom border-secondary">
            <div className="d-flex justify-content-between align-items-center small">
              <span className="text-secondary d-flex align-items-center gap-1">
                <Users size={15} /> Members
              </span>
              <span className="fw-semibold text-light">{trip.memberCount || trip.members?.length || 0}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center small">
              <span className="text-secondary d-flex align-items-center gap-1">
                <Receipt size={15} /> Total Expenses
              </span>
              <span className="fw-bold fs-6 text-emerald-400" style={{ color: '#34d399' }}>
                {formatCurrency(trip.totalExpense || 0, trip.currency)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 text-secondary micro-text" style={{ fontSize: '0.75rem' }}>
            <span>Created {formatDate(trip.createdAt)}</span>
            {trip.isOwner && (
              <span className="d-flex align-items-center gap-1 text-indigo-400" style={{ color: '#a5b4fc' }}>
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
