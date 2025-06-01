const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const generateToken = require('../utils/generateToken');
const logger = require('../utils/logger');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    if (user) {
      // Generate JWT token
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: user.toPublicProfile()
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    logger.error(`Error in register user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Register a new vendor
 * @route   POST /api/auth/register/vendor
 * @access  Public
 */
const registerVendor = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      storeName, 
      description, 
      businessEmail, 
      businessPhone, 
      businessAddress 
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user with vendor role
    const user = await User.create({
      name,
      email,
      password,
      role: 'vendor'
    });

    // Create vendor profile
    const vendor = await Vendor.create({
      userId: user._id,
      storeName,
      description,
      businessEmail: businessEmail || email,
      businessPhone,
      businessAddress
    });

    if (user && vendor) {
      // Generate JWT token
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: user.toPublicProfile(),
        vendor
      });
    } else {
      // Rollback if something went wrong
      if (user) await User.findByIdAndDelete(user._id);
      if (vendor) await Vendor.findByIdAndDelete(vendor._id);

      return res.status(400).json({
        success: false,
        message: 'Invalid vendor data'
      });
    }
  } catch (error) {
    logger.error(`Error in register vendor: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate JWT token
      const token = generateToken(user._id);

      // Get vendor data if user is a vendor
      let vendorData = null;
      if (user.role === 'vendor') {
        vendorData = await Vendor.findOne({ userId: user._id });
      }

      return res.status(200).json({
        success: true,
        token,
        user: user.toPublicProfile(),
        vendor: vendorData
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    logger.error(`Error in login user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get vendor data if user is a vendor
    let vendorData = null;
    if (user.role === 'vendor') {
      vendorData = await Vendor.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      user: user.toPublicProfile(),
      vendor: vendorData
    });
  } catch (error) {
    logger.error(`Error in get user profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.address) user.address = req.body.address;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save updated user
    const updatedUser = await user.save();

    // Generate new token to reflect any changes
    const token = generateToken(updatedUser._id);

    return res.status(200).json({
      success: true,
      token,
      user: updatedUser.toPublicProfile()
    });
  } catch (error) {
    logger.error(`Error in update user profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  registerUser,
  registerVendor,
  loginUser,
  getUserProfile,
  updateUserProfile
};