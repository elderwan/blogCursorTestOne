const express = require('express');
const { body, validationResult } = require('express-validator');
const fetch = require('node-fetch');
const Post = require('../models/Post');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;

    let query = { isPublished: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new post
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Content is required and must be less than 2000 characters'),
  body('category').optional().isIn(['daily', 'funny', 'training', 'health', 'adventure', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('content').optional().trim().isLength({ min: 1, max: 2000 }),
  body('category').optional().isIn(['daily', 'funny', 'training', 'health', 'adventure', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.likes += 1;
    await post.save();
    
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get link preview
router.post('/link-preview', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const response = await fetch(url);
    const html = await response.text();
    
    // Extract meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    
    const domain = new URL(url).hostname;
    
    const preview = {
      url,
      title: ogTitleMatch?.[1] || titleMatch?.[1] || domain,
      description: ogDescMatch?.[1] || descMatch?.[1] || '',
      thumbnail: ogImageMatch?.[1] || '',
      domain
    };
    
    res.json(preview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch link preview' });
  }
});

module.exports = router;