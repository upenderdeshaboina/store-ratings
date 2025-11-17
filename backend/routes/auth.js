const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (name.length < 20 || name.length > 60) return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    if (address.length > 400) return res.status(400).json({ message: 'Address must be less than 400 characters' });
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) return res.status(400).json({ message: 'Password must be 8-16 characters with at least one uppercase and one special character' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

    const existingUser = await User.findByEmail(email);
    if (existingUser.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, address, password: hashedPassword, role: 'normal_user' });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await User.findByEmail(email);
    if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.put('/update-password', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-16 characters with at least one uppercase and one special character' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(req.user.id, hashedPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update Password Error:', error);
    res.status(500).json({ message: 'Server error during password update' });
  }
});

router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(new_password)) {
      return res.status(400).json({ message: 'New password must be 8-16 characters with at least one uppercase and one special character' });
    }

    const users = await User.findById(req.user.id);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    const isOldPasswordMatch = await bcrypt.compare(old_password, user.password);
    if (!isOldPasswordMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    await User.updatePassword(req.user.id, hashedNewPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

module.exports = router;
