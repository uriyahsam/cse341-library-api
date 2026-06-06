const Loan = require('../models/Loan');
const Joi = require('joi');

const loanSchema = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
  memberId: Joi.string().hex().length(24).required(),
  loanDate: Joi.date().optional(),
  dueDate: Joi.date().required(),
  returnDate: Joi.date().optional().allow(null),
  status: Joi.string().valid('active', 'returned', 'overdue').optional(),
  notes: Joi.string().trim().optional().allow('')
});

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('bookId', 'title isbn')
      .populate('memberId', 'firstName lastName email');
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('bookId', 'title isbn')
      .populate('memberId', 'firstName lastName email');
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const { error, value } = loanSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const loan = new Loan(value);
    const saved = await loan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLoan = async (req, res) => {
  try {
    const { error, value } = loanSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await Loan.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Loan not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const deleted = await Loan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Loan not found' });
    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllLoans, getLoanById, createLoan, updateLoan, deleteLoan };
