const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sku: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  images: [
    {
      url: String,
      alt: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  tags: [String],
  variants: [
    {
      name: String,
      options: [
        {
          name: String,
          price: Number,
          quantity: Number,
          sku: String
        }
      ]
    }
  ],
  attributes: [
    {
      name: String,
      value: String
    }
  ],
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in'],
      default: 'cm'
    }
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  digitalAssets: [
    {
      url: String,
      fileName: String,
      fileSize: Number
    }
  ],
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected', 'archived'],
    default: 'draft'
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number
  },
  saleStartDate: {
    type: Date
  },
  saleEndDate: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  isLowStock: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Plugin for pagination
productSchema.plugin(mongoosePaginate);

// Middleware to set slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Check if low stock
  this.isLowStock = this.quantity <= this.lowStockThreshold;
  
  next();
});

// Add index for efficient querying
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ vendorId: 1 });
productSchema.index({ categories: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;