import express from 'express';
import {
  createJourney,
  getJourneys,
  getJourneyById,
  updateJourney,
  deleteJourney,
  getMyJourneys,
  saveJourney,
  unsaveJourney,
  getSavedJourneys,
  getViewedJourneysCount
} from '../controllers/journeyController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET all journeys (no auth needed)
router.get('/', getJourneys);

// Protected routes
router.post('/', protect, authorize('traveler'), upload.array('files', 10), createJourney);
router.get('/my-journeys', protect, authorize('traveler'), getMyJourneys);
router.post('/save', protect, authorize('seeker'), saveJourney);
router.post('/unsave', protect, authorize('seeker'), unsaveJourney);
router.get('/saved/all', protect, authorize('seeker'), getSavedJourneys);
router.get('/viewed/count', protect, getViewedJourneysCount);

// ID-based routes (must be last)
router.get('/:id', getJourneyById);
router.put('/:id', protect, authorize('traveler'), upload.array('files', 10), updateJourney);
router.delete('/:id', protect, authorize('traveler'), deleteJourney);

export default router;
