const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  updateProductStatus
} = require('../controllers/product.controller');
const { protect, vendor, admin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Vendor routes
router.post(
  '/',
  protect,
  vendor,
  validate([
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('quantity').isNumeric().withMessage('Quantity must be a number')
  ]),
  createProduct
);

router.put(
  '/:id',
  protect,
  vendor,
  validate([
    param('id').isMongoId().withMessage('Invalid product ID')
  ]),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  vendor,
  validate([
    param('id').isMongoId().withMessage('Invalid product ID')
  ]),
  deleteProduct
);

router.get('/vendor/products', protect, vendor, getVendorProducts);

// Admin routes
router.put(
  '/:id/status',
  protect,
  admin,
  validate([
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('status')
      .isIn(['draft', 'pending', 'published', 'rejected', 'archived'])
      .withMessage('Invalid status')
  ]),
  updateProductStatus
);

module.exports = router;