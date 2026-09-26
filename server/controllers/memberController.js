const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

// @desc    Add member to trip
// @route   POST /api/trips/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { name, mobileNumber } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Member name is required'
      });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check authorization: must be owner or member
    const isOwner = trip.createdBy.toString() === req.user._id.toString();
    const isMember = trip.members.some(
      m => m.mobileNumber === req.user.mobileNumber || m.name.toLowerCase() === req.user.name.toLowerCase()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You must be a member of this trip to add new members'
      });
    }

    const cleanName = name.trim();
    const cleanMobile = mobileNumber ? mobileNumber.toString().replace(/\D/g, '') : '';

    // Check for duplicate member name in trip
    const duplicate = trip.members.find(
      m => m.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `Member '${cleanName}' is already added to this trip`
      });
    }

    trip.members.push({
      name: cleanName,
      mobileNumber: cleanMobile
    });

    await trip.save();

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error adding member'
    });
  }
};

// @desc    Remove member from trip
// @route   DELETE /api/trips/:id/members/:memberId
// @access  Private
const deleteMember = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Only owner can remove members
    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the trip owner can remove members'
      });
    }

    const memberToDelete = trip.members.id(req.params.memberId);
    if (!memberToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this trip'
      });
    }

    // Check if member is involved in any expense
    const expenses = await Expense.find({ tripId: trip._id });
    const isPayer = expenses.some(e => e.paidBy === memberToDelete.name);
    const isParticipant = expenses.some(e => e.participants.includes(memberToDelete.name));

    if (isPayer || isParticipant) {
      return res.status(400).json({
        success: false,
        message: `Cannot remove member '${memberToDelete.name}' because they are attached to existing expenses.`
      });
    }

    trip.members.pull(req.params.memberId);
    await trip.save();

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: trip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error removing member'
    });
  }
};

module.exports = {
  addMember,
  deleteMember
};
