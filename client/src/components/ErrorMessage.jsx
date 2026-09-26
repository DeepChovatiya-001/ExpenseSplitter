import React from 'react';
import { Alert } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert
      variant="danger"
      dismissible={!!onClose}
      onClose={onClose}
      className="d-flex align-items-center gap-2 border-0 shadow-sm"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        borderLeft: '4px solid #ef4444'
      }}
    >
      <AlertTriangle size={20} className="flex-shrink-0" />
      <div>{message}</div>
    </Alert>
  );
};

export default ErrorMessage;
