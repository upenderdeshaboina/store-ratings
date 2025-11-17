const express = require('express');
const Rating = require('../models/rating');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    await Rating.create({ user_id, store_id, rating });
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Submit Rating Error:', error);
    res.status(500).json({ message: 'Server error while submitting rating' });
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const ratings = await Rating.getUserRatingForStores(req.user.id);
    res.json(ratings);
  } catch (error) {
    console.error('Get User Ratings Error:', error);
    res.status(500).json({ message: 'Server error while fetching user ratings' });
  }
});

router.get('/', authenticateToken, roleCheck(['admin']), async (req, res) => {
  try {
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const ratings = await Rating.getAllRatings(options);
    res.json(ratings);
  } catch (error) {
    console.error('Get All Ratings Error:', error);
    res.status(500).json({ message: 'Server error while fetching all ratings' });
  }
});

module.exports = router;
