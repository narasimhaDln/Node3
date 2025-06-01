const Product = require("../models/product.model");
const Vendor = require("../models/vendor.model");
const logger = require("../utils/logger");

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Vendor
 */
const createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const productData = {
      ...req.body,
      vendorId: vendor._id,
    };

    const product = await Product.create(productData);
    console.log(product);
    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error(`Error in create product: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Get all products (with filtering and pagination)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    // Pagination and filtering parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const category = req.query.category || null;
    const vendorId = req.query.vendorId || null;
    const search = req.query.search || null;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build query
    const query = { status: "published" };

    if (minPrice !== null && maxPrice !== null) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== null) {
      query.price = { $gte: minPrice };
    } else if (maxPrice !== null) {
      query.price = { $lte: maxPrice };
    }

    if (category) {
      query.categories = category;
    }

    if (vendorId) {
      query.vendorId = vendorId;
    }

    if (search) {
      query.$text = { $search: search };
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
        { path: "vendorId", select: "storeName rating" },
        { path: "categories", select: "name" },
      ],
    };

    const products = await Product.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error(`Error in get products: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendorId", "storeName rating")
      .populate("categories", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.error(`Error in get product by id: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Vendor
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const vendor = await Vendor.findOne({ userId: req.user._id });

    // Check if the product belongs to this vendor
    if (product.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    logger.error(`Error in update product: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Vendor
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const vendor = await Vendor.findOne({ userId: req.user._id });

    // Check if the product belongs to this vendor
    if (product.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.remove();

    return res.status(200).json({
      success: true,
      message: "Product removed",
    });
  } catch (error) {
    logger.error(`Error in delete product: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Get vendor products
 * @route   GET /api/products/vendor
 * @access  Private/Vendor
 */
const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || null;
    const search = req.query.search || null;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build query
    const query = { vendorId: vendor._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query with pagination
    const options = {
      page,
      limit,
      sort,
      populate: { path: "categories", select: "name" },
    };

    const products = await Product.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error(`Error in get vendor products: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Update product status (for admin)
 * @route   PUT /api/products/:id/status
 * @access  Private/Admin
 */
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product status
    product.status = status;

    // Save updated product
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    logger.error(`Error in update product status: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  updateProductStatus,
};
