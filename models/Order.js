import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // =========================
    // USER INFORMATION
    // =========================
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },

    // =========================
    // PRODUCT INFORMATION
    // =========================
    product: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        required: true,
        trim: true,
      },

      brand: {
        type: String,
        default: "",
        trim: true,
      },

      // Original product price
      price: {
        type: Number,
        required: true,
        min: 0,
      },

      // Price actually paid
      salePrice: {
        type: Number,
        min: 0,
        default: null,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      // Product-specific information
      specifications: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    // =========================
    // SHIPPING ADDRESS
    // =========================
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      addressLine: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // =========================
    // PAYMENT INFORMATION
    // =========================
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // =========================
    // PAYMENT / TOTAL
    // =========================
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =========================
    // ORDER STATUS
    // =========================
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
