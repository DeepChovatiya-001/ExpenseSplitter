import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Trash2, CreditCard, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const ExpenseCard = ({ expense, currency = 'INR', onDelete, canDelete = true }) => {
  const perPersonShare = expense.amount / (expense.participants?.length || 1);

  return (
    <Card className="glass-card border-0 mb-3">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <h6 className="fw-bold text-main mb-1">{expense.description}</h6>
            <div className="d-flex align-items-center gap-2 text-muted-custom small">
              <span className="d-flex align-items-center gap-1">
                <CreditCard size={14} style={{ color: '#6366f1' }} />
                Paid by <strong className="text-main">{expense.paidBy}</strong>
              </span>
              <span>•</span>
              <span>{formatDate(expense.createdAt)}</span>
            </div>
          </div>

          <div className="text-end">
            <div className="fw-bold fs-5" style={{ color: '#0284c7' }}>
              {formatCurrency(expense.amount, currency)}
            </div>
            <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>
              {formatCurrency(perPersonShare, currency)} / person
            </div>
          </div>
        </div>

        <hr className="my-2 theme-divider" />

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center gap-1 flex-wrap">
            <Users size={14} className="text-muted-custom me-1" />
            <span className="text-muted-custom small me-1">Split ({expense.participants?.length}):</span>
            {expense.participants?.map((p, idx) => (
              <Badge key={idx} className="me-1 font-normal" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
                {p}
              </Badge>
            ))}
          </div>

          {canDelete && onDelete && (
            <Button
              variant="link"
              className="text-danger p-0 ms-2 hover-opacity"
              onClick={() => onDelete(expense._id)}
              title="Delete expense"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpenseCard;
