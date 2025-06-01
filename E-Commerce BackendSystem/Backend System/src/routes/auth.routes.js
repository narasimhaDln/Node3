const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  registerUser, 
  registerVendor, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// Register user
router.post('/register', validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['customer', 'vendor', 'admin'])
      .withMessage('Invalid role')
  ]),
  registerUser
);

// Register vendor
router.post(
  '/register/vendor',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('storeName').notEmpty().withMessage('Store name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('businessPhone').notEmpty().withMessage('Business phone is required')
  ]),
  registerVendor
);

// Login user
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
  ]),
  loginUser
);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile
router.put(
  '/profile',
  protect,
  validate([
    body('name').optional(),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]),
  updateUserProfile
);

module.exports = router;