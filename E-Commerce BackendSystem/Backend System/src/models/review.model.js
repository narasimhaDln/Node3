const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [
    {
      url: String
    }
  ],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  vendorResponse: {
    comment: String,
    createdAt: Date
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  reportCount: {
    type: Number,
    default: 0
  },
  reports: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

// Plugin for pagination
reviewSchema.plugin(mongoosePaginate);

// Ensure review is for either a product or a vendor, not both
reviewSchema.pre('validate', function(next) {
  if (this.productId && this.vendorId) {
    next(new Error('Review can be for either a product or a vendor, not both'));
  } else if (!this.productId && !this.vendorId) {
    next(new Error('Review must be associated with either a product or a vendor'));
  } else {
    next();
  }
});

// Indexes for efficient querying
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ vendorId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;