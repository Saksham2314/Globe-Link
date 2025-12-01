import express from 'express';
import {
  createChat,
  getChats,
  getChatById,
  sendMessage
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createChat);
router.get('/', protect, getChats);
router.get('/:id', protect, getChatById);
router.post('/:id/message', protect, sendMessage);

export default router;
