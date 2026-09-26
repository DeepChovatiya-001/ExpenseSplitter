import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripService, expenseService } from '../services/api';
import Navbar from '../components/Navbar';
import MemberList from '../components/MemberList';
import MemberForm from '../components/MemberForm';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseCard from '../components/ExpenseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ArrowLeft, PlusCircle, UserPlus, Calculator, Trash2, Receipt } from 'lucide-react';

const TripDetails = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Confirm delete dialogs
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [showDeleteTripDialog, setShowDeleteTripDialog] = useState(false);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await tripService.getTripById(tripId);
      if (res.data.success) {
        setTrip(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const handleAddMember = async (memberData) => {
    const res = await tripService.addMember(tripId, memberData);
    if (res.data.success) {
      fetchTripDetails();
    }
  };

  const handleDeleteMember = async (memberId, name) => {
    try {
      const res = await tripService.deleteMember(tripId, memberId);
      if (res.data.success) {
        fetchTripDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to remove member '${name}'`);
    }
  };

  const handleAddExpense = async (expenseData) => {
    const res = await tripService.addExpense(tripId, expenseData);
    if (res.data.success) {
      fetchTripDetails();
    }
  };

  const handleDeleteExpenseConfirm = async () => {
    if (!deleteExpenseId) return;
    try {
      await expenseService.deleteExpense(deleteExpenseId);
      setDeleteExpenseId(null);
      fetchTripDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleDeleteTripConfirm = async () => {
    try {
      await tripService.deleteTrip(tripId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trip');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 pb-5">
        <Navbar />
        <LoadingSpinner message="Loading trip details..." />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-vh-100 pb-5">
        <Navbar />
        <Container className="mt-4">
          <ErrorMessage message={error || 'Trip not found'} />
          <Button as={Link} to="/dashboard" variant="secondary" className="mt-3 btn-secondary-gradient">
            Back to Dashboard
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />

      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            as={Link}
            to="/dashboard"
            variant="link"
            className="text-secondary p-0 text-decoration-none d-flex align-items-center gap-1"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>

          {trip.isOwner && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShowDeleteTripDialog(true)}
              className="d-flex align-items-center gap-1 px-3"
            >
              <Trash2 size={14} /> Delete Trip
            </Button>
          )}
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {/* Trip Summary Banner */}
        <Card className="glass-card border-0 text-light p-4 mb-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <h2 className="fw-bold brand-title mb-0 text-light">{trip.name}</h2>
                <Badge bg="indigo" className="px-3 py-1 rounded-pill" style={{ backgroundColor: '#4f46e5' }}>
                  {trip.currency || 'INR'}
                </Badge>
              </div>
              {trip.description && <p className="text-secondary mb-2">{trip.description}</p>}
              <div className="text-secondary micro-text" style={{ fontSize: '0.8rem' }}>
                Created on {formatDate(trip.createdAt)}
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button
                className="btn-primary-gradient d-flex align-items-center gap-2 py-2 px-3"
                onClick={() => setShowExpenseModal(true)}
              >
                <PlusCircle size={18} />
                <span>Add Expense</span>
              </Button>

              <Button
                as={Link}
                to={`/trips/${tripId}/settlement`}
                className="btn-secondary-gradient d-flex align-items-center gap-2 py-2 px-3 text-light"
              >
                <Calculator size={18} className="text-indigo-400" style={{ color: '#818cf8' }} />
                <span>View Settlement</span>
              </Button>
            </div>
          </div>
        </Card>

        <Row className="g-4">
          {/* Main Expense List */}
          <Col lg={8}>
            <Card className="glass-card border-0 text-light p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold text-light mb-0 d-flex align-items-center gap-2">
                    <Receipt size={20} className="text-indigo-400" style={{ color: '#818cf8' }} />
                    Expenses ({trip.expenses?.length || 0})
                  </h5>
                </div>
                <div className="text-end">
                  <span className="text-secondary small me-2">Total:</span>
                  <span className="fw-bold fs-5 text-emerald-400" style={{ color: '#34d399' }}>
                    {formatCurrency(trip.totalExpense || 0, trip.currency)}
                  </span>
                </div>
              </div>

              {trip.expenses?.length === 0 ? (
                <div className="text-center py-5">
                  <Receipt size={40} className="text-secondary opacity-50 mb-2" />
                  <h6 className="fw-bold text-light">No Expenses Recorded Yet</h6>
                  <p className="text-secondary small mb-3">Add your first expense to begin tracking and calculating settlements.</p>
                  <Button
                    size="sm"
                    className="btn-primary-gradient px-3"
                    onClick={() => setShowExpenseModal(true)}
                  >
                    + Add First Expense
                  </Button>
                </div>
              ) : (
                <div>
                  {trip.expenses.map((expense) => (
                    <ExpenseCard
                      key={expense._id}
                      expense={expense}
                      currency={trip.currency}
                      canDelete={trip.isOwner}
                      onDelete={(expId) => setDeleteExpenseId(expId)}
                    />
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Sidebar Members & Quick Stats */}
          <Col lg={4}>
            <MemberList
              members={trip.members || []}
              isOwner={trip.isOwner}
              onAddClick={() => setShowMemberModal(true)}
              onDeleteMember={handleDeleteMember}
            />
          </Col>
        </Row>
      </Container>

      {/* Add Member Modal */}
      <MemberForm
        show={showMemberModal}
        onHide={() => setShowMemberModal(false)}
        onSubmit={handleAddMember}
      />

      {/* Add Expense Modal */}
      <ExpenseForm
        show={showExpenseModal}
        onHide={() => setShowExpenseModal(false)}
        members={trip.members || []}
        currency={trip.currency}
        onSubmit={handleAddExpense}
      />

      {/* Delete Expense Confirm Dialog */}
      <ConfirmDialog
        show={!!deleteExpenseId}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDeleteExpenseConfirm}
        onCancel={() => setDeleteExpenseId(null)}
        confirmText="Delete Expense"
        variant="danger"
      />

      {/* Delete Trip Confirm Dialog */}
      <ConfirmDialog
        show={showDeleteTripDialog}
        title="Delete Entire Trip"
        message="Are you sure you want to delete this trip and ALL associated expenses? This action is permanent."
        onConfirm={handleDeleteTripConfirm}
        onCancel={() => setShowDeleteTripDialog(false)}
        confirmText="Delete Trip"
        variant="danger"
      />
    </div>
  );
};

export default TripDetails;
