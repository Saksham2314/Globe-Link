import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: null // in days
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  highlights: {
    type: [String],
    default: []
  },
  budget: {
    type: String,
    enum: ['budget', 'moderate', 'luxury'],
    default: 'moderate'
  },
  transportation: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  videos: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Journey', journeySchema);
