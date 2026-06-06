const Book = require('../models/Book');
const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  authorId: Joi.string().hex().length(24).required(),
  isbn: Joi.string().trim().required(),
  genre: Joi.string().trim().required(),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  totalCopies: Joi.number().integer().min(1).required(),
  availableCopies: Joi.number().integer().min(0).optional(),
  description: Joi.string().trim().optional().allow(''),
  coverImageUrl: Joi.string().uri().optional().allow('')
});

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('authorId', 'firstName lastName');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authorId', 'firstName lastName');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { error, value } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const book = new Book(value);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'ISBN already exists' });
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { error, value } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await Book.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
