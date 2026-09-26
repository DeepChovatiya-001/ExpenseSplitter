const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip ID is required']
  },
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0.01, 'Expense amount must be greater than 0']
  },
  paidBy: {
    type: String,
    required: [true, 'Payer is required'],
    trim: true
  },
  participants: {
    type: [String],
    required: [true, 'Participants list is required'],
    validate: [
      function (val) {
        return val && val.length > 0;
      },
      'At least one participant is required'
    ]
  },
  splitType: {
    type: String,
    enum: ['equal', 'unequal', 'percentage', 'exact'],
    default: 'equal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
