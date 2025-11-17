const express = require('express');
const Store = require('../models/store');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      address: req.query.address,
      userId: req.user.id, 
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const stores = await Store.search(filters);
    res.json(stores);
  } catch (error) {
    console.error('Get Stores Error:', error);
    res.status(500).json({ message: 'Server error while fetching stores' });
  }
});

router.get('/my-store', authenticateToken, roleCheck(['store_owner']), async (req, res) => {
  try {
    const users = await require('../models/user').findById(req.user.id);
    if (users.length === 0) return res.status(404).json({ message: 'Store owner not found.' });
    const store = await Store.findByEmail(users[0].email);
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching owner store' });
  }
});

router.post('/', authenticateToken, roleCheck(['admin']), async (req, res) => {
  try {
    const { name, address, owner_id } = req.body;

    if (!name || !address || !owner_id) {
      return res.status(400).json({ message: 'Name, address, and owner_id are required' });
    }

    const User = require('../models/user');
    const ownerUsers = await User.findById(owner_id);
    if (ownerUsers.length === 0) return res.status(404).json({ message: 'Selected owner not found.' });
    
    const email = ownerUsers[0].email;

    await Store.create({ name, email, address });
    res.status(201).json({ message: 'Store created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Store with this email already exists' });
    console.error('Create Store Error:', error);
    res.status(500).json({ message: 'Server error while creating store' });
  }
});

router.get('/:id', authenticateToken, roleCheck(['store_owner', 'admin']), async (req, res) => {
  try {
    const storeId = req.params.id;
    const [avgResult, ratings] = await Promise.all([
      Store.getAverageRating(storeId),
      Store.getRatingsByStore(storeId),
    ]);
    res.json({
      average_rating: avgResult.average_rating || 0,
      ratings: ratings,
    });
  } catch (error) {
    console.error('Get Store Details Error:', error);
    res.status(500).json({ message: 'Server error while fetching store details' });
  }
});

module.exports = router;
