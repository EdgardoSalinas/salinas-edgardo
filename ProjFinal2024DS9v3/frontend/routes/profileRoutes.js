// routes/profileRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.post('/profileUpdate', authenticateToken, updateUserProfile);

export default router;