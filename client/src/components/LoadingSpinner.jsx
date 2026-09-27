import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-main" style={{ background: 'var(--bg-primary)' }}>
        <Spinner animation="border" style={{ width: '3rem', height: '3rem', color: '#6366f1' }} />
        <p className="mt-3 text-muted-custom fw-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-5">
      <Spinner animation="border" style={{ color: '#6366f1' }} />
      {message && <p className="mt-2 text-muted-custom small">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
