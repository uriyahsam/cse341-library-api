const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, required: true, trim: true },
    publishedYear: { type: Number, required: true },
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, default: function () { return this.totalCopies; }, min: 0 },
    description: { type: String, trim: true },
    coverImageUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
