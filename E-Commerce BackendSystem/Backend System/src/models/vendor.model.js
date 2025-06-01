const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Store description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  logo: {
    type: String
  },
  coverImage: {
    type: String
  },
  businessEmail: {
    type: String,
    required: [true, 'Business email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  businessPhone: {
    type: String,
    required: [true, 'Business phone is required']
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  businessRegistrationNumber: {
    type: String
  },
  taxIdentificationNumber: {
    type: String
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    routingNumber: String
  },
  commissionRate: {
    type: Number,
    default: parseFloat(process.env.PLATFORM_COMMISSION_RATE) || 0.10
  },
  policies: {
    return: {
      type: String,
      default: 'No return policy specified'
    },
    shipping: {
      type: String,
      default: 'No shipping policy specified'
    },
    cancellation: {
      type: String,
      default: 'No cancellation policy specified'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'suspended', 'rejected'],
    default: 'pending'
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  lastPayout: {
    amount: Number,
    date: Date
  }
}, {
  timestamps: true
});

// Plugin for pagination
vendorSchema.plugin(mongoosePaginate);

// Virtual field for products
vendorSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'vendorId'
});

// Make sure virtuals are included in JSON output
vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;