import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';

const SettlementList = ({ settlement, currency = 'INR' }) => {
  if (!settlement) return null;

  const { transactions = [], balances = [], totalExpense = 0, transactionCount = 0 } = settlement;

  const creditors = balances.filter(b => b.balance > 0);
  const debtors = balances.filter(b => b.balance < 0);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Overview Cards */}
      <Row className="g-3">
        <Col md={6}>
          <Card className="glass-card border-0 p-3 h-100">
            <div className="text-muted-custom small fw-medium mb-1">Total Trip Expense</div>
            <div className="fs-3 fw-bold text-main" style={{ color: '#0284c7' }}>
              {formatCurrency(totalExpense, currency)}
            </div>
            <div className="text-muted-custom micro-text mt-1" style={{ fontSize: '0.8rem' }}>
              Calculated across all logged expenses
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="glass-card border-0 p-3 h-100">
            <div className="text-muted-custom small fw-medium mb-1">Optimal Transactions</div>
            <div className="fs-3 fw-bold" style={{ color: '#6366f1' }}>
              {transactionCount} {transactionCount === 1 ? 'Transaction' : 'Transactions'}
            </div>
            <div className="micro-text mt-1 d-flex align-items-center gap-1" style={{ color: '#10b981', fontSize: '0.8rem' }}>
              <Zap size={14} /> Minimized with Greedy Debt-Settlement Algorithm
            </div>
          </Card>
        </Col>
      </Row>

      {/* Balance Summary Header */}
      <Card className="glass-card border-0 p-3">
        <h6 className="fw-bold text-main mb-3">Settlement Summary</h6>
        <Row className="g-3">
          <Col md={6}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="fw-semibold mb-2" style={{ color: '#10b981' }}>Creditors (To Receive)</div>
              {creditors.length === 0 ? (
                <div className="text-muted-custom small">No pending creditors</div>
              ) : (
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {creditors.map((c, idx) => (
                    <li key={idx} className="small d-flex justify-content-between text-main">
                      <span>{c.person || c.name}</span>
                      <strong style={{ color: '#10b981' }}>should receive {formatCurrency(c.balance, currency)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>

          <Col md={6}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div className="fw-semibold mb-2" style={{ color: '#ef4444' }}>Debtors (To Pay)</div>
              {debtors.length === 0 ? (
                <div className="text-muted-custom small">No pending debtors</div>
              ) : (
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {debtors.map((d, idx) => (
                    <li key={idx} className="small d-flex justify-content-between text-main">
                      <span>{d.person || d.name}</span>
                      <strong style={{ color: '#ef4444' }}>should pay {formatCurrency(Math.abs(d.balance), currency)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Recommended Minimal Transactions */}
      <Card className="glass-card border-0 p-3">
        <h6 className="fw-bold text-main mb-3">Recommended Settlement Transactions</h6>

        {transactions.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle size={40} className="mb-2" style={{ color: '#10b981' }} />
            <h6 className="fw-bold text-main">All Settled Up!</h6>
            <p className="text-muted-custom small mb-0">Every member's share is equal or fully balanced. No transactions needed.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center justify-content-between p-3 rounded-3"
                style={{
                  background: 'var(--feature-card-bg)',
                  border: '1px solid var(--feature-card-border)'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
                    style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
                  >
                    {getInitials(tx.from)}
                  </div>
                  <div>
                    <div className="fw-bold text-main">{tx.from}</div>
                    <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>Payer (Debtor)</div>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-center mx-2">
                  <div className="fw-bold fs-5 px-3 py-1 rounded-pill" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
                    {formatCurrency(tx.amount, currency)}
                  </div>
                  <div className="d-flex align-items-center gap-1 text-muted-custom small mt-1">
                    <span>Pay to</span>
                    <ArrowRight size={14} style={{ color: '#6366f1' }} />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="text-end">
                    <div className="fw-bold text-main">{tx.to}</div>
                    <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>Receiver (Creditor)</div>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
                    style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}
                  >
                    {getInitials(tx.to)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SettlementList;
