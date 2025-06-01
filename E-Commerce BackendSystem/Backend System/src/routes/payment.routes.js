const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { 
  processPayment,
  processVendorPayout,
  processRefund,
  getVendorPayoutHistory
} = require('../controllers/payment.controller');
const { protect, admin, vendor } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// User routes
router.post(
  '/process',
  protect,
  validate([
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('paymentMethodId').notEmpty().withMessage('Payment method ID is required')
  ]),
  processPayment
);

// Vendor routes
router.get('/vendor-payouts', protect, vendor, getVendorPayoutHistory);

// Admin routes
router.post(
  '/payout',
  protect,
  admin,
  validate([
    body('vendorId').isMongoId().withMessage('Invalid vendor ID'),
    body('amount').isNumeric().withMessage('Amount must be a number')
  ]),
  processVendorPayout
);

router.post(
  '/refund',
  protect,
  admin,
  validate([
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('reason').notEmpty().withMessage('Reason is required')
  ]),
  processRefund
);

module.exports = router;