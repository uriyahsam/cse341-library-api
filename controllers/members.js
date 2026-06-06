const Member = require('../models/Member');
const Joi = require('joi');

const memberSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(7).required(),
  address: Joi.string().trim().required(),
  membershipType: Joi.string().valid('basic', 'premium', 'student').required(),
  joinDate: Joi.date().optional(),
  isActive: Joi.boolean().optional()
});

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { error, value } = memberSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const member = new Member(value);
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { error, value } = memberSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await Member.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Member not found' });
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMembers, getMemberById, createMember, updateMember, deleteMember };
