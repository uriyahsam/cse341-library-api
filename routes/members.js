const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/members');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Library member management
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: List of all members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       500:
 *         description: Server error
 */
router.get('/', getAllMembers);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get a member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getMemberById);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, phone, address, membershipType]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@email.com"
 *               phone:
 *                 type: string
 *                 example: "+1-555-0100"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Springfield, IL"
 *               membershipType:
 *                 type: string
 *                 enum: [basic, premium, student]
 *                 example: "basic"
 *     responses:
 *       201:
 *         description: Member created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', createMember);

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Update a member
 *     tags: [Members]
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
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Member updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateMember);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete a member
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteMember);

module.exports = router;
