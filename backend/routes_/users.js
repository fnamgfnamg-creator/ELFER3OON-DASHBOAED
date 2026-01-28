const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/join-request', userController.createJoinRequest);
router.get('/', authMiddleware, userController.getAllUsers);
router.patch('/:id/approve', authMiddleware, userController.approveUser);
router.patch('/:id/block', authMiddleware, userController.blockUser);
router.patch('/:id/unblock', authMiddleware, userController.unblockUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;