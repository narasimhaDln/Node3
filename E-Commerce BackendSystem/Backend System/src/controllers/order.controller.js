const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const logger = require('../utils/logger');

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const {
      items,
      billingAddress,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      notes
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Get product details for each item
    const orderItems = [];
    let subtotal = 0;
    let totalCommission = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      // Check if product is in stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${product.name}`
        });
      }

      // Get vendor commission rate
      const vendor = await Vendor.findById(product.vendorId);
      const commissionRate = vendor.commissionRate;

      // Calculate item price and commission
      const itemSubtotal = product.price * item.quantity;
      const commission = itemSubtotal * commissionRate;
      const vendorEarning = itemSubtotal - commission;

      // Add to order items
      orderItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images.length > 0 ? product.images[0].url : null,
        itemSubtotal,
        commission,
        vendorEarning
      });

      // Update totals
      subtotal += itemSubtotal;
      totalCommission += commission;

      // Update product quantity
      product.quantity -= item.quantity;
      product.totalSales += item.quantity;
      await product.save();

      // Update vendor stats
      vendor.totalSales += item.quantity;
      vendor.totalRevenue += vendorEarning;
      vendor.balance += vendorEarning;
      await vendor.save();
    }

    // Calculate tax and shipping
    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate;
    const shippingCost = 10; // Flat shipping rate
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      billingAddress,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      tax,
      shippingCost,
      total,
      totalCommission,
      notes
    });

    return res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    logger.error(`Error in create order: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name images')
      .populate('items.vendorId', 'storeName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user or user is admin
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    logger.error(`Error in get order by id: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    order.status = status;
    
    // Update timestamps based on status
    if (status === 'completed') {
      order.deliveredAt = Date.now();
    } else if (status === 'cancelled') {
      order.cancelledAt = Date.now();
    }
    
    // Save updated order
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    logger.error(`Error in update order status: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    order.cancelReason = reason;
    
    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        product.totalSales -= item.quantity;
        await product.save();
      }

      // Update vendor stats
      const vendor = await Vendor.findById(item.vendorId);
      if (vendor) {
        vendor.totalSales -= item.quantity;
        vendor.totalRevenue -= item.vendorEarning;
        vendor.balance -= item.vendorEarning;
        await vendor.save();
      }
    }
    
    // Save updated order
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    logger.error(`Error in cancel order: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get user orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query with pagination
    const options = {
      page,
      limit,
      sort,
      populate: [
        { path: 'items.productId', select: 'name images' },
        { path: 'items.vendorId', select: 'storeName' }
      ]
    };

    const orders = await Order.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    logger.error(`Error in get user orders: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all orders (for admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query with pagination
    const options = {
      page,
      limit,
      sort,
      populate: [
        { path: 'userId', select: 'name email' },
        { path: 'items.productId', select: 'name images' },
        { path: 'items.vendorId', select: 'storeName' }
      ]
    };

    const orders = await Order.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    logger.error(`Error in get all orders: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
  getAllOrders
};