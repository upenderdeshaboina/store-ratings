const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', authenticateToken, roleCheck(['admin']), dashboardController.getDashboardStats);

module.exports = router;