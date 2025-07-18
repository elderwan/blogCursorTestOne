const express = require('express');
const { body, validationResult } = require('express-validator');
const Album = require('../models/Album');

const router = express.Router();

// Get all albums
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const albums = await Album.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Album.countDocuments({ isPublic: true });

    res.json({
      albums,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single album
router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new album
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update album
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete album
router.delete('/:id', async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add image to album
router.post('/:id/images', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    album.images.push(req.body);
    await album.save();
    
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove image from album
router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    album.images = album.images.filter(img => img._id.toString() !== req.params.imageId);
    await album.save();
    
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;