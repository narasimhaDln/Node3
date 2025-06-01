const Order = require('../models/order.model');
const Vendor = require('../models/vendor.model');
const User = require('../models/user.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

/**
 * @desc    Process payment with Stripe
 * @route   POST /api/payments/process
 * @access  Private
 */
const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    // Get order
    const order = await Order.findById(orderId);

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
        message: 'Not authorized to process payment for this order'
      });
    }

    // Check if order is already paid
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is already processed'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Order ${order.orderNumber}`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    // Update order with payment details
    order.paymentDetails = {
      transactionId: paymentIntent.id,
      status: paymentIntent.status,
      cardLast4: paymentIntent.payment_method_details?.card?.last4 || null
    };

    // Update order status
    order.status = 'processing';

    // Save updated order
    await order.save();

    return res.status(200).json({
      success: true,
      paymentIntent
    });
  } catch (error) {
    logger.error(`Error in process payment: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Process vendor payout
 * @route   POST /api/payments/payout
 * @access  Private/Admin
 */
const processVendorPayout = async (req, res) => {
  try {
    const { vendorId, amount } = req.body;

    // Get vendor
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Check if vendor has enough balance
    if (vendor.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Vendor does not have enough balance'
      });
    }

    // Process payout (in a real app, this would integrate with a payment provider)
    // For demonstration, we'll just update the vendor's balance
    vendor.balance -= amount;
    vendor.lastPayout = {
      amount,
      date: Date.now()
    };

    // Save updated vendor
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: 'Payout processed successfully',
      payout: {
        amount,
        date: vendor.lastPayout.date,
        vendor: {
          id: vendor._id,
          storeName: vendor.storeName
        }
      }
    });
  } catch (error) {
    logger.error(`Error in process vendor payout: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Process refund
 * @route   POST /api/payments/refund
 * @access  Private/Admin
 */
const processRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    // Get order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be refunded
    if (order.status !== 'completed' && order.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be refunded at this stage'
      });
    }

    // Get transaction ID
    const transactionId = order.paymentDetails.transactionId;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'No payment transaction found for this order'
      });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer'
    });

    // Update order with refund details
    order.refundStatus = amount === order.total ? 'full' : 'partial';
    order.refundAmount = amount;
    order.refundReason = reason;
    
    // If full refund, update order status
    if (amount === order.total) {
      order.status = 'refunded';
    }

    // Save updated order
    await order.save();

    return res.status(200).json({
      success: true,
      refund,
      order
    });
  } catch (error) {
    logger.error(`Error in process refund: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get vendor payout history
 * @route   GET /api/payments/vendor-payouts
 * @access  Private/Vendor
 */
const getVendorPayoutHistory = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // In a real application, you would query a payouts collection
    // For this demo, we'll just return the last payout if it exists
    const payouts = [];
    
    if (vendor.lastPayout && vendor.lastPayout.amount) {
      payouts.push({
        amount: vendor.lastPayout.amount,
        date: vendor.lastPayout.date,
        status: 'completed'
      });
    }

    return res.status(200).json({
      success: true,
      balance: vendor.balance,
      payouts
    });
  } catch (error) {
    logger.error(`Error in get vendor payout history: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  processPayment,
  processVendorPayout,
  processRefund,
  getVendorPayoutHistory
};