import Journey from '../models/Journey.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { fileToBase64, isBase64Image } from '../middleware/upload.js';

export const createJourney = async (req, res) => {
  try {
    const { title, description, startLocation, endLocation, startDate, endDate, highlights, budget, transportation } = req.body;
    
    if (!title || !description || !startLocation || !endLocation) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Handle file uploads - convert to base64
    const images = [];
    const videos = [];
    
    if (req.files) {
      req.files.forEach(file => {
        const base64Data = fileToBase64(file);
        if (base64Data) {
          if (file.mimetype.startsWith('image/')) {
            images.push(base64Data);
          } else if (file.mimetype.startsWith('video/')) {
            videos.push(base64Data);
          }
        }
      });
    }
    
    const journey = await Journey.create({
      title,
      description,
      startLocation,
      endLocation,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
      traveler: req.user.id,
      highlights: Array.isArray(highlights) ? highlights : [highlights],
      budget,
      transportation: Array.isArray(transportation) ? transportation : [transportation],
      images,
      videos
    });
    
    res.status(201).json({
      success: true,
      journey
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJourneys = async (req, res) => {
  try {
    const { search, fromLocation, toLocation, location, startDate, endDate } = req.query;
    let query = {};
    
    // Handle route-based filtering (from -> to) with AND logic
    if (fromLocation || toLocation) {
      if (fromLocation) {
        query.startLocation = { $regex: fromLocation, $options: 'i' };
      }
      if (toLocation) {
        query.endLocation = { $regex: toLocation, $options: 'i' };
      }
    }
    // Handle search if no route filter
    else if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { highlights: { $elemMatch: { $regex: search, $options: 'i' } } },
        { transportation: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    // Handle general location filtering (either from or to)
    else if (location) {
      query.$or = [
        { startLocation: { $regex: location, $options: 'i' } },
        { endLocation: { $regex: location, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }
    
    const journeys = await Journey.find(query).populate('traveler', 'name profileImage bio location').sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: journeys.length,
      journeys
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJourneyById = async (req, res) => {
  try {
    const journey = await Journey.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('traveler', 'name profileImage bio location email');
    
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    
    // Track viewed journey for authenticated seekers only
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        // Only track for seekers
        if (user && user.userType === 'seeker' && !user.viewedJourneys.includes(req.params.id)) {
          user.viewedJourneys.push(req.params.id);
          await user.save();
        }
      } catch (err) {
        // Continue even if token verification fails (non-authenticated users)
      }
    }
    
    res.status(200).json({
      success: true,
      journey
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJourney = async (req, res) => {
  try {
    let journey = await Journey.findById(req.params.id);
    
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    
    if (journey.traveler.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this journey' });
    }
    
    const { title, description, startLocation, endLocation, startDate, endDate, highlights, budget, transportation, existingImages } = req.body;
    
    // Handle file uploads - keep existing base64 images and add new ones
    let images = existingImages ? JSON.parse(existingImages) : [];
    const videos = [];
    
    if (req.files) {
      req.files.forEach(file => {
        const base64Data = fileToBase64(file);
        if (base64Data) {
          if (file.mimetype.startsWith('image/')) {
            images.push(base64Data);
          } else if (file.mimetype.startsWith('video/')) {
            videos.push(base64Data);
          }
        }
      });
    }
    
    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const updatedJourney = await Journey.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        startLocation,
        endLocation,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration,
        highlights: highlights ? JSON.parse(highlights) : [],
        budget,
        transportation: transportation ? JSON.parse(transportation) : [],
        images,
        videos,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('traveler', 'name profileImage');
    
    res.status(200).json({
      success: true,
      journey: updatedJourney
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);
    
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    
    if (journey.traveler.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this journey' });
    }
    
    await Journey.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Journey deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ traveler: req.user.id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: journeys.length,
      journeys
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveJourney = async (req, res) => {
  try {
    const { journeyId } = req.body;
    
    const user = await User.findById(req.user.id);
    const journey = await Journey.findById(journeyId);
    
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    
    // Check if already saved
    if (user.savedJourneys.includes(journeyId)) {
      return res.status(400).json({ message: 'Journey already saved' });
    }
    
    user.savedJourneys.push(journeyId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Journey saved successfully',
      savedCount: user.savedJourneys.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveJourney = async (req, res) => {
  try {
    const { journeyId } = req.body;
    
    const user = await User.findById(req.user.id);
    
    user.savedJourneys = user.savedJourneys.filter(id => id.toString() !== journeyId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Journey unsaved successfully',
      savedCount: user.savedJourneys.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedJourneys = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedJourneys');
    
    res.status(200).json({
      success: true,
      count: user.savedJourneys.length,
      journeys: user.savedJourneys
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getViewedJourneysCount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      count: user.viewedJourneys?.length || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
