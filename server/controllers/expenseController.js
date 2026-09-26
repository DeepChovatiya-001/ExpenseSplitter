const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// @desc    Add expense to trip
// @route   POST /api/trips/:id/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, participants, splitType } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Expense description is required'
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Expense amount must be a positive number greater than 0'
      });
    }

    if (!paidBy || !paidBy.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Payer (paidBy) is required'
      });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one participant is required'
      });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Verify member existence in trip
    const memberNames = trip.members.map(m => m.name.toLowerCase());
    const payerNameClean = paidBy.trim();

    if (!memberNames.includes(payerNameClean.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Payer '${payerNameClean}' is not a registered member of this trip`
      });
    }

    const cleanParticipants = participants.map(p => p.trim());
    for (const p of cleanParticipants) {
      if (!memberNames.includes(p.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Participant '${p}' is not a member of this trip`
        });
      }
    }

    const expense = await Expense.create({
      tripId: trip._id,
      description: description.trim(),
      amount: numAmount,
      paidBy: payerNameClean,
      participants: cleanParticipants,
      splitType: splitType || 'equal'
    });

    return res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error adding expense'
    });
  }
};

// @desc    Get expenses for trip
// @route   GET /api/trips/:id/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const expenses = await Expense.find({ tripId: req.params.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching expenses'
    });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    const { description, amount, paidBy, participants, splitType } = req.body;

    if (description !== undefined) expense.description = description.trim();
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
      expense.amount = numAmount;
    }

    if (paidBy !== undefined) expense.paidBy = paidBy.trim();
    if (participants !== undefined) expense.participants = participants;
    if (splitType !== undefined) expense.splitType = splitType;

    await expense.save();

    return res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating expense'
    });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting expense'
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
