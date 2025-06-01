const Vendor = require('../models/vendor.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const logger = require('../utils/logger');

/**
 * @desc    Get vendor profile
 * @route   GET /api/vendors/profile
 * @access  Private/Vendor
 */
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      vendor
    });
  } catch (error) {
    logger.error(`Error in get vendor profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update vendor profile
 * @route   PUT /api/vendors/profile
 * @access  Private/Vendor
 */
const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Update vendor fields
    const {
      storeName,
      description,
      businessEmail,
      businessPhone,
      businessAddress,
      policies
    } = req.body;

    if (storeName) vendor.storeName = storeName;
    if (description) vendor.description = description;
    if (businessEmail) vendor.businessEmail = businessEmail;
    if (businessPhone) vendor.businessPhone = businessPhone;
    if (businessAddress) vendor.businessAddress = businessAddress;
    if (policies) {
      vendor.policies = {
        ...vendor.policies,
        ...policies
      };
    }

    // Save updated vendor
    const updatedVendor = await vendor.save();

    return res.status(200).json({
      success: true,
      vendor: updatedVendor
    });
  } catch (error) {
    logger.error(`Error in update vendor profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update vendor payment details
 * @route   PUT /api/vendors/payment-details
 * @access  Private/Vendor
 */
const updatePaymentDetails = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const { bankName, accountNumber, accountHolderName, routingNumber } = req.body;

    // Update payment details
    vendor.paymentDetails = {
      bankName,
      accountNumber,
      accountHolderName,
      routingNumber
    };

    // Save updated vendor
    const updatedVendor = await vendor.save();

    return res.status(200).json({
      success: true,
      paymentDetails: updatedVendor.paymentDetails
    });
  } catch (error) {
    logger.error(`Error in update payment details: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get vendor orders
 * @route   GET /api/vendors/orders
 * @access  Private/Vendor
 */
const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = { 'items.vendorId': vendor._id };
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
        { path: 'items.productId', select: 'name images' }
      ]
    };

    const orders = await Order.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    logger.error(`Error in get vendor orders: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update order item status (for vendor items only)
 * @route   PUT /api/vendors/orders/:orderId/items/:itemId
 * @access  Private/Vendor
 */
const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status, trackingNumber, trackingCompany } = req.body;

    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Find the item in the order that belongs to this vendor
    const orderItem = order.items.id(itemId);

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    // Check if the item belongs to this vendor
    if (orderItem.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order item'
      });
    }

    // Update the item status
    if (status) orderItem.status = status;
    if (trackingNumber) orderItem.trackingNumber = trackingNumber;
    if (trackingCompany) orderItem.trackingCompany = trackingCompany;

    // Save the updated order
    await order.save();

    // Check if all items are delivered and update the main order status
    if (status === 'delivered') {
      const allItemsDelivered = order.items.every(item => item.status === 'delivered');
      if (allItemsDelivered) {
        order.status = 'completed';
        order.deliveredAt = Date.now();
        await order.save();
      }
    }

    return res.status(200).json({
      success: true,
      orderItem
    });
  } catch (error) {
    logger.error(`Error in update order item status: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get vendor dashboard summary
 * @route   GET /api/vendors/dashboard
 * @access  Private/Vendor
 */
const getVendorDashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Calculate the date for the start of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get total products count
    const totalProducts = await Product.countDocuments({ vendorId: vendor._id });
    
    // Get orders statistics
    const pendingOrders = await Order.countDocuments({ 
      'items.vendorId': vendor._id, 
      'items.status': 'processing' 
    });
    
    // Get orders for this month
    const ordersThisMonth = await Order.find({
      'items.vendorId': vendor._id,
      createdAt: { $gte: startOfMonth }
    });
    
    // Calculate revenue for this month
    const revenueThisMonth = ordersThisMonth.reduce((total, order) => {
      const vendorItems = order.items.filter(item => 
        item.vendorId.toString() === vendor._id.toString()
      );
      
      const vendorRevenue = vendorItems.reduce((sum, item) => sum + item.vendorEarning, 0);
      return total + vendorRevenue;
    }, 0);

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({ 
      vendorId: vendor._id,
      isLowStock: true
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        pendingOrders,
        revenueThisMonth,
        lowStockProducts,
        totalSales: vendor.totalSales,
        totalRevenue: vendor.totalRevenue,
        rating: vendor.rating,
        balance: vendor.balance
      }
    });
  } catch (error) {
    logger.error(`Error in get vendor dashboard: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all vendors (for admin)
 * @route   GET /api/vendors
 * @access  Private/Admin
 */
const getAllVendors = async (req, res) => {
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
      populate: { path: 'userId', select: 'name email' }
    };

    const vendors = await Vendor.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: vendors
    });
  } catch (error) {
    logger.error(`Error in get all vendors: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update vendor status (for admin)
 * @route   PUT /api/vendors/:id/status
 * @access  Private/Admin
 */
const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Update vendor status
    vendor.status = status;
    
    if (status === 'approved') {
      vendor.approvedAt = Date.now();
      vendor.approvedBy = req.user._id;
    }

    // Save updated vendor
    const updatedVendor = await vendor.save();

    return res.status(200).json({
      success: true,
      vendor: updatedVendor
    });
  } catch (error) {
    logger.error(`Error in update vendor status: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  updatePaymentDetails,
  getVendorOrders,
  updateOrderItemStatus,
  getVendorDashboard,
  getAllVendors,
  updateVendorStatus
};