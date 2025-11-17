const User = require('../models/user');
const Store = require('../models/store');
const Rating = require('../models/rating');

/**
 * Gathers and returns statistics for the admin dashboard.
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch user count, store count, and rating count all at once.
    const [users, stores, ratings] = await Promise.all([
      User.getAll(),
      Store.getAll(),
      Rating.getTotalCount(),
    ]);

    res.json({
      total_users: users.length,
      total_stores: stores.length,
      total_ratings: ratings.total_ratings,
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};