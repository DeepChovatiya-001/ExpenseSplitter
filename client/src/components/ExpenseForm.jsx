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
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="glass-card text-light border-0">
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title className="d-flex align-items-center gap-2 h5 mb-0">
          <PlusCircle size={20} className="text-indigo-400" style={{ color: '#818cf8' }} />
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
                    <option key={m._id || idx} value={m.name} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
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
                  <option value="equal" style={{ backgroundColor: '#0f172a', color: '#fff' }}>Equal Split</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12} className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="form-label-custom mb-0">Split Between ({participants.length} selected)</Form.Label>
                <Button
                  variant="link"
                  className="p-0 text-indigo-400 small text-decoration-none"
                  style={{ color: '#818cf8' }}
                  onClick={selectAllParticipants}
                >
                  Select All
                </Button>
              </div>

              <div className="p-3 rounded-3" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Row className="g-2">
                  {members.map((m, idx) => {
                    const isChecked = participants.includes(m.name);
                    return (
                      <Col key={m._id || idx} xs={6} sm={4}>
                        <div
                          className={`d-flex align-items-center gap-2 p-2 rounded-2 cursor-pointer transition-all ${
                            isChecked ? 'bg-indigo-900-30 border-indigo-500' : ''
                          }`}
                          style={{
                            background: isChecked ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${isChecked ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.05)'}`,
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleParticipant(m.name)}
                        >
                          {isChecked ? (
                            <CheckSquare size={18} className="text-indigo-400" style={{ color: '#818cf8' }} />
                          ) : (
                            <Square size={18} className="text-secondary" />
                          )}
                          <span className="small text-light text-truncate">{m.name}</span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>

              {perPersonShare > 0 && (
                <div className="mt-3 p-2 px-3 rounded-2 text-center" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                  Each person pays: <strong>{formatCurrency(perPersonShare, currency)}</strong>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-secondary">
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
