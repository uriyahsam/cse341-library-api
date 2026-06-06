const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/books');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Library book management
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (requires authentication)
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, authorId, isbn, genre, publishedYear, totalCopies]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               authorId:
 *                 type: string
 *                 example: "665f1a2b3c4d5e6f7a8b9c0e"
 *               isbn:
 *                 type: string
 *                 example: "978-0-7432-7356-5"
 *               genre:
 *                 type: string
 *                 example: "Fiction"
 *               publishedYear:
 *                 type: integer
 *                 example: 1925
 *               totalCopies:
 *                 type: integer
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: "A classic American novel."
 *               coverImageUrl:
 *                 type: string
 *                 example: "https://example.com/cover.jpg"
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', isAuthenticated, createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book (requires authentication)
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put('/:id', isAuthenticated, updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book (requires authentication)
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isAuthenticated, deleteBook);

module.exports = router;
