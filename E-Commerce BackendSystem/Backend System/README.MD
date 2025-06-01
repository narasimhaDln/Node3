# Multi-Vendor E-Commerce Marketplace API

A robust, scalable backend system for managing a multi-vendor e-commerce marketplace built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (customer, vendor, admin)
  - Password encryption with bcrypt
  - Password reset functionality

- **Vendor Management**
  - Vendor registration and onboarding
  - Store profile management
  - Dashboard analytics

- **Product Management**
  - CRUD operations for products
  - Product categories and attributes
  - Search and filtering
  - Image upload support

- **Order Processing**
  - Cart functionality
  - Order history and tracking
  - Order status management

- **Payment Integration**
  - Secure payment processing with Stripe
  - Multiple payment methods

- **Security Features**
  - Rate limiting
  - Helmet security headers
  - Input validation
  - Error handling middleware

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Payment Processing**: Stripe API
- **Validation**: express-validator
- **Logging**: Winston, Morgan
- **File Upload**: Multer
- **Security**: Helmet, cors, bcryptjs
- **Testing**: Jest, Supertest

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password` - Reset password

### Vendors
- `POST /api/vendors` - Register as a vendor
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `PUT /api/vendors/:id` - Update vendor profile
- `DELETE /api/vendors/:id` - Delete vendor account

### Products
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/vendor/products` - Get vendor's products
- `PUT /api/products/:id/status` - Update product status

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/user/orders` - Get user's orders
- `GET /api/orders/vendor/orders` - Get vendor's orders

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/webhook` - Handle payment webhook

## API Response Formats

### Success Responses

All successful API responses follow a standard format:

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "message": "Operation completed successfully"
}
```

#### Example: Get Product Response

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Smartphone X Pro",
    "description": "Latest smartphone with advanced features",
    "price": 999.99,
    "category": "Electronics",
    "vendor": "60d21b4667d0d8992e610c80",
    "images": ["image1.jpg", "image2.jpg"],
    "rating": 4.5,
    "numReviews": 12,
    "countInStock": 7,
    "createdAt": "2023-10-15T18:22:45.555Z",
    "updatedAt": "2023-10-15T18:22:45.555Z"
  },
  "message": "Product retrieved successfully"
}
```

#### Example: Paginated List Response

```json
{
  "success": true,
  "data": {
    "docs": [
      // Array of items
    ],
    "totalDocs": 50,
    "limit": 10,
    "totalPages": 5,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Products retrieved successfully"
}
```

### Error Responses

All error responses follow a standard format:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Error message explaining what went wrong"
  }
}
```

#### Common HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side error

#### Example: Validation Error

```json
{
  "success": false,
  "error": {
    "statusCode": 422,
    "message": "Validation failed",
    "errors": [
      {
        "field": "email",
        "message": "Please enter a valid email address"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Stripe account for payment processing

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd multi-vendor-marketplace
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Start the development server
   ```
   npm run dev
   ```

### Running Tests
```
npm test
```

## Project Structure
src/
├── config/
│   └── db.js                  # Database configuration
├── controllers/              # Route handlers (controllers)
│   ├── auth.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── product.controller.js
│   └── vendor.controller.js
├── middleware/               # Custom middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── models/                   # Mongoose models (schemas)
│   ├── order.model.js
│   ├── product.model.js
│   ├── review.model.js
│   ├── user.model.js
│   └── vendor.model.js
├── routes/                   # API routes
│   ├── auth.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── product.routes.js
│   ├── review.routes.js
│   └── vendor.routes.js
├── utils/                    # Utility functions
│   ├── generateToken.js
│   └── logger.js
└── server.js                 # Application entry point


## Security Considerations

- All passwords are hashed using bcrypt
- JWT authentication for protected routes
- Rate limiting to prevent brute force attacks
- Helmet for securing HTTP headers
- Input validation for all API endpoints
- Error handling middleware

## License

This project is licensed under the MIT License - see the LICENSE file for details.
