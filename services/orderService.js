import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (
  userId,
  productId,
  quantity,
  shippingAddress,
  paymentMethod,
) => {
  // Find user
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Validate quantity
  const orderQuantity = Number(quantity);

  if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
    throw new Error("Invalid quantity");
  }

  // Check stock
  if (product.stock < orderQuantity) {
    throw new Error("Not enough stock");
  }

  // ======================================================
  // SHIPPING ADDRESS VALIDATION
  // ======================================================

  if (!shippingAddress) {
    throw new Error("Shipping address is required");
  }

  const { fullName, phone, email, addressLine, city, state, pincode } =
    shippingAddress;

  if (
    !fullName ||
    !phone ||
    !email ||
    !addressLine ||
    !city ||
    !state ||
    !pincode
  ) {
    throw new Error("Complete shipping address is required");
  }

  // ======================================================
  // PAYMENT METHOD
  // ======================================================

  const allowedPaymentMethods = ["COD", "ONLINE"];

  if (!paymentMethod) {
    paymentMethod = "COD";
  }

  if (!allowedPaymentMethods.includes(paymentMethod)) {
    throw new Error("Invalid payment method");
  }

  // ======================================================
  // USE SALE PRICE IF AVAILABLE
  // ======================================================

  const purchasePrice =
    product.salePrice !== null && product.salePrice !== undefined
      ? product.salePrice
      : product.price;

  // ======================================================
  // CALCULATE TOTAL
  // ======================================================

  const totalAmount = purchasePrice * orderQuantity;

  // ======================================================
  // CREATE ORDER
  // ======================================================

  const order = await Order.create({
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
    },

    product: {
      productId: product._id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      quantity: orderQuantity,
      specifications: product.specifications || {},
    },

    // ====================================================
    // SHIPPING
    // ====================================================

    shippingAddress: {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    },

    // ====================================================
    // PAYMENT
    // ====================================================

    paymentMethod,

    // For COD payment remains pending
    paymentStatus: "Pending",

    // ====================================================
    // TOTAL / STATUS
    // ====================================================

    totalAmount,

    status: "Pending",
  });

  // ======================================================
  // REDUCE PRODUCT STOCK
  // ======================================================

  product.stock -= orderQuantity;

  await product.save();

  return order;
};

// ======================================================
// GET ALL ORDERS
// ADMIN
// ======================================================

export const getAllOrders = async ({
  search,
  status,
  category,
  minAmount,
  maxAmount,
  sortBy = "createdAt",
  order = "desc",
} = {}) => {
  const filter = {};

  // Search by customer name,
  // customer email or product name
  if (search) {
    const searchValue = search.trim();

    filter.$or = [
      {
        "user.name": {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        "user.email": {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        "product.name": {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Category filter
  if (category) {
    filter["product.category"] = {
      $regex: `^${category.trim()}$`,
      $options: "i",
    };
  }

  // Minimum order amount
  if (minAmount !== undefined && minAmount !== "") {
    filter.totalAmount = {
      ...filter.totalAmount,
      $gte: Number(minAmount),
    };
  }

  // Maximum order amount
  if (maxAmount !== undefined && maxAmount !== "") {
    filter.totalAmount = {
      ...filter.totalAmount,
      $lte: Number(maxAmount),
    };
  }

  // Allowed sorting fields
  const allowedSortFields = [
    "createdAt",
    "totalAmount",
    "status",
    "user.name",
    "product.name",
  ];

  const selectedSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const selectedOrder = order === "asc" ? 1 : -1;

  const orders = await Order.find(filter).sort({
    [selectedSortField]: selectedOrder,
  });

  return orders;
};

// ======================================================
// GET USER'S ORDERS
// ======================================================

export const getMyOrders = async (
  userId,
  { status, sortBy = "createdAt", order = "desc" } = {},
) => {
  const filter = {
    "user.userId": userId,
  };

  // Status filter
  if (status) {
    filter.status = status;
  }

  const allowedSortFields = ["createdAt", "totalAmount", "status"];

  const selectedSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const selectedOrder = order === "asc" ? 1 : -1;

  const orders = await Order.find(filter).sort({
    [selectedSortField]: selectedOrder,
  });

  return orders;
};

// ======================================================
// GET SINGLE ORDER
// ======================================================

export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// ======================================================
// ADMIN UPDATE ORDER STATUS
// ======================================================

export const updateOrderStatus = async (orderId, status) => {
  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;

  await order.save();

  return order;
};
