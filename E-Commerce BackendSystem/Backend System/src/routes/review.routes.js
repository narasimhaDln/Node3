const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Vendor = require('../models/vendor.model');
const logger = require('../utils/logger');

// Create a review
router.post(
  '/',
  protect,
  validate([
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Review comment is required'),
    body('productId')
      .optional()
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('vendorId')
      .optional()
      .isMongoId()
      .withMessage('Invalid vendor ID')
  ]),
  async (req, res) => {
    try {
      const { rating, title, comment, productId, vendorId, images } = req.body;

      // Validate that either productId or vendorId is provided, not both
      if ((productId && vendorId) || (!productId && !vendorId)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either a product ID or vendor ID, not both'
        });
      }

      // Check if product/vendor exists
      if (productId) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Product not found'
          });
        }
      }

      if (vendorId) {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
          return res.status(404).json({
            success: false,
            message: 'Vendor not found'
          });
        }
      }

      // Create review
      const review = await Review.create({
        userId: req.user._id,
        productId,
        vendorId,
        rating,
        title,
        comment,
        images,
        status: 'pending'
      });

      // Update product/vendor rating
      if (productId) {
        const product = await Product.findById(productId);
        const reviews = await Review.find({ productId });
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
        
        product.rating = avgRating;
        product.totalReviews = reviews.length;
        await product.save();
      }

      if (vendorId) {
        const vendor = await Vendor.findById(vendorId);
        const reviews = await Review.find({ vendorId });
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
        
        vendor.rating = avgRating;
        vendor.totalReviews = reviews.length;
        await vendor.save();
      }

      return res.status(201).json({
        success: true,
        review
      });
    } catch (error) {
      logger.error(`Error in create review: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// Get product reviews
router.get(
  '/product/:productId',
  validate([
    param('productId').isMongoId().withMessage('Invalid product ID')
  ]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      const options = {
        page,
        limit,
        sort: { [sortBy]: sortOrder },
        populate: { path: 'userId', select: 'name' }
      };

      const reviews = await Review.paginate(
        { 
          productId: req.params.productId,
          status: 'approved'
        },
        options
      );

      return res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      logger.error(`Error in get product reviews: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// Get vendor reviews
router.get(
  '/vendor/:vendorId',
  validate([
    param('vendorId').isMongoId().withMessage('Invalid vendor ID')
  ]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      const options = {
        page,
        limit,
        sort: { [sortBy]: sortOrder },
        populate: { path: 'userId', select: 'name' }
      };

      const reviews = await Review.paginate(
        { 
          vendorId: req.params.vendorId,
          status: 'approved'
        },
        options
      );

      return res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      logger.error(`Error in get vendor reviews: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// Update review (only for review owner)
router.put(
  '/:id',
  protect,
  validate([
    param('id').isMongoId().withMessage('Invalid review ID'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .notEmpty()
      .withMessage('Review comment is required')
  ]),
  async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review
      if (review.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this review'
        });
      }

      // Update review
      const { rating, title, comment, images } = req.body;
      
      if (rating) review.rating = rating;
      if (title) review.title = title;
      if (comment) review.comment = comment;
      if (images) review.images = images;

      // Reset status to pending for re-approval
      review.status = 'pending';
      
      const updatedReview = await review.save();

      return res.status(200).json({
        success: true,
        review: updatedReview
      });
    } catch (error) {
      logger.error(`Error in update review: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// Delete review (only for review owner)
router.delete(
  '/:id',
  protect,
  validate([
    param('id').isMongoId().withMessage('Invalid review ID')
  ]),
  async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review
      if (review.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        });
      }

      await review.remove();

      // Update product/vendor rating
      if (review.productId) {
        const product = await Product.findById(review.productId);
        const reviews = await Review.find({ productId: review.productId });
        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
          : 0;
        
        product.rating = avgRating;
        product.totalReviews = reviews.length;
        await product.save();
      }

      if (review.vendorId) {
        const vendor = await Vendor.findById(review.vendorId);
        const reviews = await Review.find({ vendorId: review.vendorId });
        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
          : 0;
        
        vendor.rating = avgRating;
        vendor.totalReviews = reviews.length;
        await vendor.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Review removed'
      });
    } catch (error) {
      logger.error(`Error in delete review: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

module.exports = router;