const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', authenticateToken, roleCheck(['admin']), async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const users = await User.search(filters);
    res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

router.post('/', authenticateToken, roleCheck(['admin']), async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (name.length < 20 || name.length > 60) return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    if (address.length > 400) return res.status(400).json({ message: 'Address must be less than 400 characters' });
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) return res.status(400).json({ message: 'Password must be 8-16 characters with at least one uppercase and one special character' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

    const existingUser = await User.findByEmail(email);
    if (existingUser.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, address, password: hashedPassword, role });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
});

module.exports = router;
