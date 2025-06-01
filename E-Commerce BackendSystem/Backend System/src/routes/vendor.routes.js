const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { 
  getVendorProfile,
  updateVendorProfile,
  updatePaymentDetails,
  getVendorOrders,
  updateOrderItemStatus,
  getVendorDashboard,
  getAllVendors,
  updateVendorStatus
} = require('../controllers/vendor.controller');
const { protect, vendor, admin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// Vendor routes
router.get('/profile', protect, vendor, getVendorProfile);
router.put(
  '/profile',
  protect,
  vendor,
  validate([
    body('storeName').optional(),
    body('description').optional(),
    body('businessEmail').optional().isEmail().withMessage('Please include a valid email'),
    body('businessPhone').optional(),
    body('businessAddress').optional()
  ]),
  updateVendorProfile
);

router.put(
  '/payment-details',
  protect,
  vendor,
  validate([
    body('bankName').notEmpty().withMessage('Bank name is required'),
    body('accountNumber').notEmpty().withMessage('Account number is required'),
    body('accountHolderName').notEmpty().withMessage('Account holder name is required'),
    body('routingNumber').notEmpty().withMessage('Routing number is required')
  ]),
  updatePaymentDetails
);

router.get('/orders', protect, vendor, getVendorOrders);
router.put(
  '/orders/:orderId/items/:itemId',
  protect,
  vendor,
  validate([
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    param('itemId').isMongoId().withMessage('Invalid item ID'),
    body('status')
      .optional()
      .isIn(['processing', 'shipped', 'delivered', 'cancelled', 'returned'])
      .withMessage('Invalid status')
  ]),
  updateOrderItemStatus
);

router.get('/dashboard', protect, vendor, getVendorDashboard);

// Admin routes for managing vendors
router.get('/', protect, admin, getAllVendors);
router.put(
  '/:id/status',
  protect,
  admin,
  validate([
    param('id').isMongoId().withMessage('Invalid vendor ID'),
    body('status')
      .isIn(['pending', 'approved', 'suspended', 'rejected'])
      .withMessage('Invalid status')
  ]),
  updateVendorStatus
);

module.exports = router;