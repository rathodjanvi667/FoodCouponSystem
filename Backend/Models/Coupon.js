const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    // =====================================
    // COUPON CODE
    // =====================================

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    // =====================================
    // DISCOUNT
    // =====================================

    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },

    // =====================================
    // MINIMUM ORDER AMOUNT
    // =====================================

    minOrderAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    // =====================================
    // VALID FROM
    // =====================================

    validFrom: {
      type: Date,
      required: true
    },

    // =====================================
    // VALID UNTIL
    // =====================================

    validUntil: {
      type: Date,
      required: true
    },

    // =====================================
    // VALID AT / RESTAURANT
    // =====================================

    store: {
      type: String,
      required: true
    },

    // =====================================
    // DESCRIPTION
    // =====================================

    description: {
      type: String,
      required: true
    },

    // =====================================
    // ACTIVE / INACTIVE
    // =====================================

    isActive: {
      type: Boolean,
      default: true
    },

    // =====================================
    // COUPON TYPE
    // admin = Admin created
    // generated = Customer generated
    // =====================================

    type: {
      type: String,
      enum: ["admin", "generated"],
      default: "admin"
    },

    // =====================================
    // GENERATED COUPON STATUS
    // =====================================

    status: {
      type: String,
      enum: [
        "generated",
        "used",
        "expired"
      ],
      default: "generated"
    },

    // =====================================
    // CUSTOMER DETAILS
    // =====================================

    customerName: {
      type: String,
      default: ""
    },

    customerMobile: {
      type: String,
      default: ""
    },

    // =====================================
    // ORDER ID
    // =====================================

    orderId: {
      type: String,
      default: ""
    },

    // =====================================
    // CUSTOMER CART ITEMS
    // =====================================

    items: {
      type: Array,
      default: []
    },

    // =====================================
    // ORDER TOTAL
    // =====================================

    totalAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Coupon",
  couponSchema
);