import express from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/auth';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
