import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { UserPlus, User, Trash2 } from 'lucide-react';
import { getInitials } from '../utils/formatters';

const MemberList = ({ members = [], isOwner, onAddClick, onDeleteMember }) => {
  return (
    <Card className="glass-card border-0 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-main mb-0 d-flex align-items-center gap-2">
          <User size={18} style={{ color: '#6366f1' }} />
          Trip Participants ({members.length})
        </h6>
        <Button
          size="sm"
          className="btn-primary-gradient d-flex align-items-center gap-1 py-1 px-3"
          onClick={onAddClick}
        >
          <UserPlus size={14} />
          <span>Add Member</span>
        </Button>
      </div>

      <div className="d-flex flex-column gap-2 max-h-300 overflow-auto pe-1">
        {members.map((member, index) => (
          <div
            key={member._id || index}
            className="d-flex justify-content-between align-items-center p-2 rounded-3"
            style={{ background: 'var(--feature-card-bg)', border: '1px solid var(--feature-card-border)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
                style={{
                  width: '32px',
                  height: '32px',
                  background: `linear-gradient(135deg, ${
                    index % 3 === 0 ? '#4f46e5, #06b6d4' : index % 3 === 1 ? '#10b981, #059669' : '#8b5cf6, #ec4899'
                  })`
                }}
              >
                {getInitials(member.name)}
              </div>
              <div>
                <div className="fw-semibold text-main small lh-1">{member.name}</div>
                {member.mobileNumber && (
                  <div className="text-muted-custom micro-text" style={{ fontSize: '0.75rem' }}>
                    📱 {member.mobileNumber}
                  </div>
                )}
              </div>
            </div>

            {isOwner && index > 0 && onDeleteMember && (
              <Button
                variant="link"
                className="text-danger p-0 ms-2 opacity-75 hover-opacity-100"
                onClick={() => onDeleteMember(member._id, member.name)}
                title="Remove member"
              >
                <Trash2 size={15} />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MemberList;
