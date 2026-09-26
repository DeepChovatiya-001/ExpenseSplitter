import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';

const BalanceCard = ({ balances = [], currency = 'INR' }) => {
  return (
    <Card className="glass-card border-0 text-light p-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Wallet size={20} className="text-indigo-400" style={{ color: '#818cf8' }} />
        <h6 className="fw-bold text-light mb-0">Member Balance Summary</h6>
      </div>

      <div className="table-responsive">
        <Table hover variant="dark" className="align-middle mb-0 bg-transparent">
          <thead>
            <tr className="text-secondary small border-secondary">
              <th>Member</th>
              <th className="text-end">Paid</th>
              <th className="text-end">Share</th>
              <th className="text-end">Net Balance</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b, idx) => {
              const name = b.person || b.name;
              const net = b.balance;
              const isCreditor = net > 0;
              const isDebtor = net < 0;

              return (
                <tr key={idx} className="border-secondary">
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white micro-text"
                        style={{
                          width: '28px',
                          height: '28px',
                          fontSize: '0.75rem',
                          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)'
                        }}
                      >
                        {getInitials(name)}
                      </div>
                      <span className="fw-semibold text-light small">{name}</span>
                    </div>
                  </td>
                  <td className="text-end text-secondary small">{formatCurrency(b.totalPaid, currency)}</td>
                  <td className="text-end text-secondary small">{formatCurrency(b.totalShare, currency)}</td>
                  <td className="text-end">
                    {isCreditor && (
                      <span className="badge-creditor d-inline-flex align-items-center gap-1">
                        <ArrowUpRight size={14} />
                        +{formatCurrency(net, currency)}
                      </span>
                    )}
                    {isDebtor && (
                      <span className="badge-debtor d-inline-flex align-items-center gap-1">
                        <ArrowDownRight size={14} />
                        {formatCurrency(net, currency)}
                      </span>
                    )}
                    {!isCreditor && !isDebtor && (
                      <span className="badge-settled d-inline-flex align-items-center gap-1">
                        <CheckCircle2 size={14} />
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default BalanceCard;
