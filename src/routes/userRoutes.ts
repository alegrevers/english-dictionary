import { Router } from 'express';
import {
  getUserProfile,
  getUserHistory,
  getUserFavorites,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/user/me', authMiddleware, getUserProfile);
router.get('/user/me/history', authMiddleware, getUserHistory);
router.get('/user/me/favorites', authMiddleware, getUserFavorites);

export default router;
