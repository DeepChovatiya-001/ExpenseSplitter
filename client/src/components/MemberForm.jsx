import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { UserPlus } from 'lucide-react';
import ErrorMessage from './ErrorMessage';

const MemberForm = ({ show, onHide, onSubmit }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Member name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({ name: name.trim(), mobileNumber: mobileNumber.trim() });
      setName('');
      setMobileNumber('');
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-card text-light border-0">
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title className="d-flex align-items-center gap-2 h5 mb-0">
          <UserPlus size={20} className="text-indigo-400" style={{ color: '#818cf8' }} />
          Add Trip Member
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-3">
          <ErrorMessage message={error} onClose={() => setError('')} />

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Member Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Rahul, Amit, Priya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Mobile Number (Optional)</Form.Label>
            <Form.Control
              type="tel"
              placeholder="e.g. 9876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="form-control-custom"
            />
            <Form.Text className="text-secondary small">
              Members do not need an account to participate in trips.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={onHide} className="btn-secondary-gradient">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="btn-primary-gradient px-4">
            {submitting ? 'Adding...' : 'Add Member'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MemberForm;
