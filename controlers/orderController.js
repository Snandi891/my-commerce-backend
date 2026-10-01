import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../services/orderService.js";

// ======================================================
// CREATE ORDER
// ======================================================

export const create = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, paymentMethod } = req.body;

    // Product validation
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    // Address validation
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // Payment validation
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    const order = await createOrder(
      req.user.id,
      productId,
      quantity,
      shippingAddress,
      paymentMethod,
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL ORDERS
// ======================================================

export const getAll = async (req, res) => {
  try {
    const orders = await getAllOrders();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// USER GET OWN ORDERS
// ======================================================

export const getMine = async (req, res) => {
  try {
    const orders = await getMyOrders(req.user.id);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADMIN UPDATE STATUS
// ======================================================

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await updateOrderStatus(req.params.id, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
