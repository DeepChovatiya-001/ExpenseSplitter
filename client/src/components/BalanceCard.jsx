import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';

const BalanceCard = ({ balances = [], currency = 'INR' }) => {
  return (
    <Card className="glass-card border-0 p-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Wallet size={20} style={{ color: '#6366f1' }} />
        <h6 className="fw-bold text-main mb-0">Member Balance Summary</h6>
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle mb-0 bg-transparent text-main">
          <thead>
            <tr className="text-muted-custom small border-bottom theme-divider">
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
                <tr key={idx} className="border-bottom theme-divider">
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
                      <span className="fw-semibold text-main small">{name}</span>
                    </div>
                  </td>
                  <td className="text-end text-muted-custom small">{formatCurrency(b.totalPaid, currency)}</td>
                  <td className="text-end text-muted-custom small">{formatCurrency(b.totalShare, currency)}</td>
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
