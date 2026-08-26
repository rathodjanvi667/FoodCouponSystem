const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },

    minOrderAmount: {
      type: Number,
      required: true,
      min: 0
    },

    validFrom: {
      type: Date,
      required: true
    },

    validUntil: {
      type: Date,
      required: true
    },

    store: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Coupon", couponSchema);