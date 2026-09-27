import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AlertCircle } from 'lucide-react';

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger' }) => {
  return (
    <Modal show={show} onHide={onCancel} centered contentClassName="glass-card border-0">
      <Modal.Header closeButton className="border-bottom theme-divider">
        <Modal.Title className="d-flex align-items-center gap-2 h5 mb-0 text-main">
          <AlertCircle size={22} className={variant === 'danger' ? 'text-danger' : 'text-warning'} />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3">
        <p className="text-muted-custom mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-top theme-divider">
        <Button variant="secondary" onClick={onCancel} className="btn-secondary-gradient px-4">
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} className="px-4">
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
