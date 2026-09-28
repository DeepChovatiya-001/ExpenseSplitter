const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const { getTripSettlement } = require('../services/settlementService');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const { name, description, currency, initialMembers } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Trip name is required'
      });
    }

    // Automatically add creator as the first member
    const creatorMember = {
      name: req.user.name || `User-${req.user.mobileNumber.slice(-4)}`,
      mobileNumber: req.user.mobileNumber
    };

    const members = [creatorMember];

    // Add optional initial members if provided
    if (Array.isArray(initialMembers)) {
      initialMembers.forEach(m => {
        if (m && m.name && m.name.trim()) {
          const cleanName = m.name.trim();
          const cleanMobile = m.mobileNumber ? m.mobileNumber.toString().replace(/\D/g, '') : '';
          // Avoid duplicate by name
          if (!members.some(existing => existing.name.toLowerCase() === cleanName.toLowerCase())) {
            members.push({ name: cleanName, mobileNumber: cleanMobile });
          }
        }
      });
    }

    const trip = await Trip.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      currency: currency ? currency.trim().toUpperCase() : 'INR',
      createdBy: req.user._id,
      members
    });

    return res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating trip'
    });
  }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    // User is owner OR user's mobile number is in trip members
    // NOTE: Name matching is intentionally excluded to prevent trips from showing
    // up for users who happen to share the same name as a member in another user's trip.
    const query = { createdBy: req.user._id };
    if (req.user.mobileNumber) {
      query.$or = [
        { createdBy: req.user._id },
        { 'members.mobileNumber': req.user.mobileNumber }
      ];
      delete query.createdBy;
    }
    const trips = await Trip.find(query).sort({ createdAt: -1 });

    // Attach summary stats (expense count, total expense)
    const tripIds = trips.map(t => t._id);
    const expenses = await Expense.find({ tripId: { $in: tripIds } });

    const tripsWithStats = trips.map(trip => {
      const tripExpenses = expenses.filter(e => e.tripId.toString() === trip._id.toString());
      const totalExpense = tripExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        ...trip.toObject(),
        memberCount: trip.members.length,
        expenseCount: tripExpenses.length,
        totalExpense: Number(totalExpense.toFixed(2))
      };
    });

    return res.status(200).json({
      success: true,
      data: tripsWithStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching trips'
    });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check authorization: must be creator or member
    const isOwner = trip.createdBy.toString() === req.user._id.toString();
    // Only match by mobileNumber (unique), not by name (not unique across users)
    const isMember = req.user.mobileNumber
      ? trip.members.some(m => m.mobileNumber === req.user.mobileNumber)
      : false;

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not a member of this trip'
      });
    }

    const expenses = await Expense.find({ tripId: trip._id }).sort({ createdAt: -1 });
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return res.status(200).json({
      success: true,
      data: {
        ...trip.toObject(),
        isOwner,
        expenses,
        totalExpense: Number(totalExpense.toFixed(2))
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching trip details'
    });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the trip owner can update trip details'
      });
    }

    const { name, description, currency } = req.body;
    if (name) trip.name = name.trim();
    if (description !== undefined) trip.description = description.trim();
    if (currency) trip.currency = currency.trim().toUpperCase();

    await trip.save();

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating trip'
    });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the trip owner can delete this trip'
      });
    }

    // Delete associated expenses first
    await Expense.deleteMany({ tripId: trip._id });
    await trip.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Trip and associated expenses deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting trip'
    });
  }
};

// @desc    Get trip settlement calculations
// @route   GET /api/trips/:id/settlement
// @access  Private
const getSettlement = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check authorization
    const isOwner = trip.createdBy.toString() === req.user._id.toString();
    // Only match by mobileNumber (unique), not by name (not unique across users)
    const isMember = req.user.mobileNumber
      ? trip.members.some(m => m.mobileNumber === req.user.mobileNumber)
      : false;

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to view settlements for this trip'
      });
    }

    const settlementData = await getTripSettlement(req.params.id);

    return res.status(200).json({
      success: true,
      data: settlementData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error calculating settlement'
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getSettlement
};
