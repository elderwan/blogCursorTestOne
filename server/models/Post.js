const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  images: [{
    url: String,
    caption: String,
    cloudinaryId: String
  }],
  video: {
    url: String,
    caption: String,
    cloudinaryId: String
  },
  sharedLink: {
    url: String,
    title: String,
    description: String,
    thumbnail: String,
    domain: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['daily', 'funny', 'training', 'health', 'adventure', 'other'],
    default: 'daily'
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validate images array length
postSchema.pre('save', function(next) {
  if (this.images && this.images.length > 18) {
    const error = new Error('Maximum 18 images allowed per post');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);