const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { 
  createOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
  getAllOrders
} = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// User routes
router.post(
  '/',
  protect,
  validate([
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('billingAddress').notEmpty().withMessage('Billing address is required'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required')
  ]),
  createOrder
);

router.get('/my-orders', protect, getUserOrders);

router.get(
  '/:id',
  protect,
  validate([
    param('id').isMongoId().withMessage('Invalid order ID')
  ]),
  getOrderById
);

router.put(
  '/:id/cancel',
  protect,
  validate([
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('reason').notEmpty().withMessage('Cancellation reason is required')
  ]),
  cancelOrder
);

// Admin routes
router.get('/', protect, admin, getAllOrders);

router.put(
  '/:id/status',
  protect,
  admin,
  validate([
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status')
      .isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded'])
      .withMessage('Invalid status')
  ]),
  updateOrderStatus
);

module.exports = router;