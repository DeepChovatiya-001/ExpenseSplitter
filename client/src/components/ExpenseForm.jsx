import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { PlusCircle, CheckSquare, Square } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import { formatCurrency } from '../utils/formatters';

const ExpenseForm = ({ show, onHide, members = [], currency = 'INR', onSubmit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([]);
  const [splitType, setSplitType] = useState('equal');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (members && members.length > 0) {
      if (!paidBy) setPaidBy(members[0].name);
      if (participants.length === 0) setParticipants(members.map(m => m.name));
    }
  }, [members]);

  const toggleParticipant = (name) => {
    if (participants.includes(name)) {
      if (participants.length === 1) {
        setError('At least one participant must be selected');
        return;
      }
      setParticipants(participants.filter(p => p !== name));
    } else {
      setParticipants([...participants, name]);
    }
  };

  const selectAllParticipants = () => {
    setParticipants(members.map(m => m.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Please enter expense description');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number greater than 0');
      return;
    }

    if (!paidBy) {
      setError('Please select who paid for this expense');
      return;
    }

    if (participants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        description: description.trim(),
        amount: numAmount,
        paidBy,
        participants,
        splitType
      });
      setDescription('');
      setAmount('');
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const perPersonShare = amount && Number(amount) > 0 && participants.length > 0
    ? Number(amount) / participants.length
    : 0;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="glass-card border-0">
      <Modal.Header closeButton className="border-bottom theme-divider">
        <Modal.Title className="d-flex align-items-center gap-2 h5 mb-0 text-main">
          <PlusCircle size={20} style={{ color: '#6366f1' }} />
          Add Expense
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-3">
          <ErrorMessage message={error} onClose={() => setError('')} />

          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="form-label-custom">Expense Description *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Dinner, Hotel booking, Gas bill"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control-custom"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="form-label-custom">Amount ({currency}) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-control-custom"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-custom">Paid By *</Form.Label>
                <Form.Select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="form-control-custom"
                >
                  {members.map((m, idx) => (
                    <option key={m._id || idx} value={m.name} style={{ background: 'var(--card-bg-solid)', color: 'var(--text-main)' }}>
                      {m.name} {m.mobileNumber ? `(${m.mobileNumber})` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-custom">Split Type</Form.Label>
                <Form.Select
                  value={splitType}
                  onChange={(e) => setSplitType(e.target.value)}
                  className="form-control-custom"
                >
                  <option value="equal" style={{ background: 'var(--card-bg-solid)', color: 'var(--text-main)' }}>Equal Split</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12} className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="form-label-custom mb-0">Split Between ({participants.length} selected)</Form.Label>
                <Button
                  variant="link"
                  className="p-0 small text-decoration-none"
                  style={{ color: 'var(--link-color)' }}
                  onClick={selectAllParticipants}
                >
                  Select All
                </Button>
              </div>

              <div className="p-3 rounded-3" style={{ background: 'var(--feature-card-bg)', border: '1px solid var(--feature-card-border)' }}>
                <Row className="g-2">
                  {members.map((m, idx) => {
                    const isChecked = participants.includes(m.name);
                    return (
                      <Col key={m._id || idx} xs={6} sm={4}>
                        <div
                          className="d-flex align-items-center gap-2 p-2 rounded-2 cursor-pointer transition-all"
                          style={{
                            background: isChecked ? 'var(--badge-bg)' : 'transparent',
                            border: `1px solid ${isChecked ? 'var(--badge-border)' : 'var(--card-border)'}`,
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleParticipant(m.name)}
                        >
                          {isChecked ? (
                            <CheckSquare size={18} style={{ color: '#6366f1' }} />
                          ) : (
                            <Square size={18} className="text-muted-custom" />
                          )}
                          <span className="small text-main text-truncate">{m.name}</span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>

              {perPersonShare > 0 && (
                <div className="mt-3 p-2 px-3 rounded-2 text-center" style={{ background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', color: 'var(--link-color)' }}>
                  Each person pays: <strong>{formatCurrency(perPersonShare, currency)}</strong>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-top theme-divider">
          <Button variant="secondary" onClick={onHide} className="btn-secondary-gradient">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="btn-primary-gradient px-4">
            {submitting ? 'Saving...' : 'Add Expense'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;
