const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    _id: {
      type: String
    },

    id: {
      type: String
    },

    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
);


const orderSchema = new mongoose.Schema(
  {
    // =====================================
    // ORDER NUMBER
    // =====================================

    orderNumber: {
      type: String,
      required: true,
      unique: true
    },


    // =====================================
    // CUSTOMER DETAILS
    // =====================================

    customer: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    state: {
      type: String,
      required: true,
      trim: true
    },

    pincode: {
      type: String,
      required: true,
      trim: true
    },


    // =====================================
    // ORDER ITEMS
    // =====================================

    items: {
      type: [orderItemSchema],
      required: true
    },


    // =====================================
    // BILL DETAILS
    // =====================================

    subtotal: {
      type: Number,
      required: true,
      default: 0
    },

    deliveryFee: {
      type: Number,
      default: 0
    },

    gst: {
      type: Number,
      default: 0
    },

    discount: {
      type: Number,
      default: 0
    },

    total: {
      type: Number,
      required: true,
      default: 0
    },


    // =====================================
    // PAYMENT
    // =====================================

    paymentMethod: {
      type: String,
      required: true
    },


    // =====================================
    // COUPON
    // =====================================

    couponCode: {
      type: String,
      default: ""
    },


    // =====================================
    // ORDER STATUS
    // =====================================

    status: {
      type: String,

      enum: [
        "Pending",
        "Preparing",
        "Delivered",
        "Cancelled"
      ],

      default: "Pending"
    }
  },

  {
    timestamps: true
  }
);


module.exports = mongoose.model(
  "Order",
  orderSchema
);