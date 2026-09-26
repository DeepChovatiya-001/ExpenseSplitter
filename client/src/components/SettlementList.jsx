import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { ArrowRight, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
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
          <Card className="glass-card border-0 p-3 h-100 text-light">
            <div className="text-secondary small fw-medium mb-1">Total Trip Expense</div>
            <div className="fs-3 fw-bold text-light" style={{ color: '#38bdf8' }}>
              {formatCurrency(totalExpense, currency)}
            </div>
            <div className="text-secondary micro-text mt-1" style={{ fontSize: '0.8rem' }}>
              Calculated across all logged expenses
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="glass-card border-0 p-3 h-100 text-light">
            <div className="text-secondary small fw-medium mb-1">Optimal Transactions</div>
            <div className="fs-3 fw-bold text-indigo-400" style={{ color: '#818cf8' }}>
              {transactionCount} {transactionCount === 1 ? 'Transaction' : 'Transactions'}
            </div>
            <div className="text-emerald-400 micro-text mt-1 d-flex align-items-center gap-1" style={{ color: '#34d399', fontSize: '0.8rem' }}>
              <Zap size={14} /> Minimized with Greedy Debt-Settlement Algorithm
            </div>
          </Card>
        </Col>
      </Row>

      {/* Balance Summary Header */}
      <Card className="glass-card border-0 text-light p-3">
        <h6 className="fw-bold text-light mb-3">Settlement Summary</h6>
        <Row className="g-3">
          <Col md={6}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="fw-semibold text-emerald-400 mb-2" style={{ color: '#34d399' }}>Creditors (To Receive)</div>
              {creditors.length === 0 ? (
                <div className="text-secondary small">No pending creditors</div>
              ) : (
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {creditors.map((c, idx) => (
                    <li key={idx} className="small d-flex justify-content-between text-light">
                      <span>{c.person || c.name}</span>
                      <strong style={{ color: '#34d399' }}>should receive {formatCurrency(c.balance, currency)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>

          <Col md={6}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div className="fw-semibold text-red-400 mb-2" style={{ color: '#f87171' }}>Debtors (To Pay)</div>
              {debtors.length === 0 ? (
                <div className="text-secondary small">No pending debtors</div>
              ) : (
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {debtors.map((d, idx) => (
                    <li key={idx} className="small d-flex justify-content-between text-light">
                      <span>{d.person || d.name}</span>
                      <strong style={{ color: '#f87171' }}>should pay {formatCurrency(Math.abs(d.balance), currency)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Recommended Minimal Transactions */}
      <Card className="glass-card border-0 text-light p-3">
        <h6 className="fw-bold text-light mb-3">Recommended Settlement Transactions</h6>

        {transactions.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle size={40} className="text-emerald-400 mb-2" style={{ color: '#34d399' }} />
            <h6 className="fw-bold text-light">All Settled Up!</h6>
            <p className="text-secondary small mb-0">Every member's share is equal or fully balanced. No transactions needed.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center justify-content-between p-3 rounded-3 text-light"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
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
                    <div className="fw-bold text-light">{tx.from}</div>
                    <div className="text-secondary micro-text" style={{ fontSize: '0.75rem' }}>Payer (Debtor)</div>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-center mx-2">
                  <div className="fw-bold fs-5 px-3 py-1 rounded-pill" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    {formatCurrency(tx.amount, currency)}
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary small mt-1">
                    <span>Pay to</span>
                    <ArrowRight size={14} className="text-indigo-400" />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="text-end">
                    <div className="fw-bold text-light">{tx.to}</div>
                    <div className="text-secondary micro-text" style={{ fontSize: '0.75rem' }}>Receiver (Creditor)</div>
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
