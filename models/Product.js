import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // Category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Brand
    brand: {
      type: String,
      trim: true,
      default: "",
    },

    // Original price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Selling price after discount
    salePrice: {
      type: Number,
      min: 0,
      default: null,
    },

    // Discount percentage
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Product description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Product image
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // Product stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Unique product code
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    // Product status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Rating
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // Number of reviews
    reviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Category-specific information
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
