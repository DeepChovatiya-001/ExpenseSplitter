const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getSettlement
} = require('../controllers/tripController');
const { addMember, deleteMember } = require('../controllers/memberController');
const { addExpense, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createTrip)
  .get(getTrips);

router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

// Settlement
router.get('/:id/settlement', getSettlement);

// Member sub-routes
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', deleteMember);

// Expense sub-routes for trip
router.route('/:id/expenses')
  .post(addExpense)
  .get(getExpenses);

module.exports = router;
