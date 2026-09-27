import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { tripService } from '../services/api';
import Navbar from '../components/Navbar';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle, ArrowLeft, Trash2, UserPlus, Compass } from 'lucide-react';

const CreateTrip = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [members, setMembers] = useState([
    { name: 'Rahul', mobileNumber: '9876543210' },
    { name: 'Amit', mobileNumber: '9876543211' }
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleAddMemberRow = () => {
    setMembers([...members, { name: '', mobileNumber: '' }]);
  };

  const handleRemoveMemberRow = (index) => {
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a trip name');
      return;
    }

    try {
      setSubmitting(true);
      const initialMembers = members
        .filter(m => m.name && m.name.trim())
        .map(m => ({ name: m.name.trim(), mobileNumber: m.mobileNumber ? m.mobileNumber.trim() : '' }));

      const res = await tripService.createTrip({
        name: name.trim(),
        description: description.trim(),
        currency: currency.trim(),
        initialMembers
      });

      if (res.data.success) {
        navigate(`/trips/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />

      <Container className="mt-4" style={{ maxWidth: '800px' }}>
        <div className="mb-3">
          <Button
            as={Link}
            to="/dashboard"
            variant="link"
            className="text-muted-custom p-0 text-decoration-none d-flex align-items-center gap-1"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
        </div>

        <Card className="glass-card border-0 p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-3 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}
            >
              <Compass size={24} className="text-white" />
            </div>
            <div>
              <h3 className="fw-bold brand-title mb-0 text-main">Create New Trip / Event</h3>
              <p className="text-muted-custom small mb-0">Set up a group trip, party, or shared living expense space</p>
            </div>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} />

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Trip Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Goa Vacation, Roommate Bills, Birthday Party"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control-custom"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Currency</Form.Label>
                  <Form.Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-control-custom"
                  >
                    <option value="INR" style={{ background: 'var(--card-bg-solid)', color: 'var(--text-main)' }}>INR (₹)</option>
                    <option value="USD" style={{ background: 'var(--card-bg-solid)', color: 'var(--text-main)' }}>USD ($)</option>
                    <option value="EUR" style={{ background: 'var(--card-bg-solid)', color: 'var(--text-main)' }}>EUR (€)</option>
                    <option value="GBP" style={{ background: 'var(--card-bg-solid)', color: 'var(--text-main)' }}>GBP (£)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="form-label-custom">Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="e.g. College friends Goa trip expenses, food, stay, travel"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>

              {/* Initial Members Section */}
              <Col md={12} className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="form-label-custom mb-0">
                    Add Initial Participants
                  </Form.Label>
                  <Button
                    variant="link"
                    className="p-0 small text-decoration-none d-flex align-items-center gap-1"
                    onClick={handleAddMemberRow}
                    style={{ color: 'var(--link-color)' }}
                  >
                    <UserPlus size={16} /> + Add Another
                  </Button>
                </div>

                <p className="text-muted-custom micro-text mb-3" style={{ fontSize: '0.8rem' }}>
                  You (logged-in user) are automatically added as the trip creator. Add other friends below!
                </p>

                {members.map((member, idx) => (
                  <Row key={idx} className="g-2 mb-2 align-items-center">
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder={`Member ${idx + 1} Name`}
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="form-control-custom"
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="tel"
                        placeholder="Mobile (Optional)"
                        value={member.mobileNumber}
                        onChange={(e) => handleMemberChange(idx, 'mobileNumber', e.target.value)}
                        className="form-control-custom"
                      />
                    </Col>
                    <Col md={1} className="text-center">
                      <Button
                        variant="link"
                        className="text-danger p-0 opacity-75 hover-opacity-100"
                        onClick={() => handleRemoveMemberRow(idx)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Col>

              <Col md={12} className="mt-4 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-gradient w-100 py-3 font-semibold d-flex align-items-center justify-content-center gap-2"
                >
                  <PlusCircle size={20} />
                  <span>{submitting ? 'Creating Trip...' : 'Create Trip'}</span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default CreateTrip;
