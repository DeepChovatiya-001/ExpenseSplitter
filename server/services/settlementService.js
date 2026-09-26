const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const { calculateMemberBalances, calculateSettlements } = require('../utils/settlementAlgorithm');

/**
 * Service to calculate full settlement for a trip
 * @param {string} tripId
 */
const getTripSettlement = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error('Trip not found');
  }

  const expenses = await Expense.find({ tripId });

  // Format members
  const memberList = trip.members.map(m => ({ name: m.name, mobileNumber: m.mobileNumber, _id: m._id }));

  // Calculate balances
  const balances = calculateMemberBalances(memberList, expenses);

  // Calculate optimal transactions
  const transactions = calculateSettlements(balances);

  // Total trip expense
  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return {
    tripId: trip._id,
    tripName: trip.name,
    currency: trip.currency || 'INR',
    totalExpense: Number(totalExpense.toFixed(2)),
    memberCount: trip.members.length,
    expenseCount: expenses.length,
    balances,
    transactions,
    transactionCount: transactions.length
  };
};

module.exports = {
  getTripSettlement
};
