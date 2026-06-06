const express = require('express');
const router = express.Router();
const { getAllLoans, getLoanById, createLoan, updateLoan, deleteLoan } = require('../controllers/loans');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Book loan management
 */

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: List of all loans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 *       500:
 *         description: Server error
 */
router.get('/', getAllLoans);

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Get a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loan found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getLoanById);

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Create a new loan (requires authentication)
 *     tags: [Loans]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId, memberId, dueDate]
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "665f1a2b3c4d5e6f7a8b9c0d"
 *               memberId:
 *                 type: string
 *                 example: "665f1a2b3c4d5e6f7a8b9c0f"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *               notes:
 *                 type: string
 *                 example: "Summer reading loan"
 *     responses:
 *       201:
 *         description: Loan created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', isAuthenticated, createLoan);

/**
 * @swagger
 * /loans/{id}:
 *   put:
 *     summary: Update a loan (requires authentication)
 *     tags: [Loans]
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
 *             $ref: '#/components/schemas/Loan'
 *     responses:
 *       200:
 *         description: Loan updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Server error
 */
router.put('/:id', isAuthenticated, updateLoan);

/**
 * @swagger
 * /loans/{id}:
 *   delete:
 *     summary: Delete a loan (requires authentication)
 *     tags: [Loans]
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
 *         description: Loan deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isAuthenticated, deleteLoan);

module.exports = router;
