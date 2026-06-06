const express = require('express');
const router = express.Router();
const { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authors');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of all authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
 */
router.get('/', getAllAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author (requires authentication)
 *     tags: [Authors]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, nationality, birthYear, genres, biography, email]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "F. Scott"
 *               lastName:
 *                 type: string
 *                 example: "Fitzgerald"
 *               nationality:
 *                 type: string
 *                 example: "American"
 *               birthYear:
 *                 type: integer
 *                 example: 1896
 *               deathYear:
 *                 type: integer
 *                 example: 1940
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Fiction", "Literary Fiction"]
 *               biography:
 *                 type: string
 *                 example: "Francis Scott Key Fitzgerald was an American novelist known for The Great Gatsby."
 *               email:
 *                 type: string
 *                 example: "fitzgerald@library.com"
 *               website:
 *                 type: string
 *                 example: "https://fitzgerald.com"
 *     responses:
 *       201:
 *         description: Author created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', isAuthenticated, createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author (requires authentication)
 *     tags: [Authors]
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
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.put('/:id', isAuthenticated, updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author (requires authentication)
 *     tags: [Authors]
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
 *         description: Author deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isAuthenticated, deleteAuthor);

module.exports = router;
