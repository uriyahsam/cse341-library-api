const Author = require('../models/Author');
const Joi = require('joi');

const authorSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  nationality: Joi.string().trim().required(),
  birthYear: Joi.number().integer().min(1).max(new Date().getFullYear()).required(),
  deathYear: Joi.number().integer().min(1).max(new Date().getFullYear()).optional().allow(null),
  genres: Joi.array().items(Joi.string()).min(1).required(),
  biography: Joi.string().trim().min(20).required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().optional().allow('')
});

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { error, value } = authorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const author = new Author(value);
    const saved = await author.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { error, value } = authorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await Author.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
