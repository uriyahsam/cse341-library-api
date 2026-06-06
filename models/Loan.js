const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    bookId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Book',   required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    loanDate:   { type: Date, default: Date.now },
    dueDate:    { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', loanSchema);
