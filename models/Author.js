const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    nationality: { type: String, required: true, trim: true },
    birthYear: { type: Number, required: true },
    deathYear: { type: Number, default: null },
    genres: { type: [String], required: true },
    biography: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    website: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);
