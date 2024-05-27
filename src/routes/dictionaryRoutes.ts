import { Router } from 'express';
import {
  getDictionaryWords,
  getWordDetails,
  favoriteWord,
  unfavoriteWord,
} from '../controllers/dictionaryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/entries/en', authMiddleware, getDictionaryWords);
router.get('/entries/en/:word', authMiddleware, getWordDetails);
router.post('/entries/en/:word/favorite', authMiddleware, favoriteWord);
router.delete('/entries/en/:word/unfavorite', authMiddleware, unfavoriteWord);

export default router;
