import express from "express";

import {
  create,
  getAll,
  getMine,
  updateStatus,
} from "../controlers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ======================================================
// USER ROUTES
// ======================================================

// USER CREATE ORDER
// POST /api/orders
router.post("/", authMiddleware, create);

// USER SEE OWN ORDERS
// GET /api/orders/my-orders
router.get("/my-orders", authMiddleware, getMine);

// ======================================================
// ADMIN ROUTES
// ======================================================

// ADMIN SEE ALL ORDERS
// Supports search, category, status,
// amount filtering and sorting
//
// GET /api/orders
router.get("/", authMiddleware, adminMiddleware, getAll);

// ADMIN UPDATE ORDER STATUS
// PUT /api/orders/:id/status
router.put("/:id/status", authMiddleware, adminMiddleware, updateStatus);

// ======================================================
// ORDER API EXAMPLES
// ======================================================
//
// Base URL:
// /api/orders
//
//
// ------------------------------------------------------
// 1. USER CREATE ORDER
// ------------------------------------------------------
//
// POST /api/orders
//
// Body:
// {
//   "productId": "PRODUCT_ID",
//   "quantity": 2
// }
//
// Authorization:
// Bearer USER_TOKEN
//
//
// ------------------------------------------------------
// 2. USER GET OWN ORDERS
// ------------------------------------------------------
//
// GET /api/orders/my-orders
//
// Authorization:
// Bearer USER_TOKEN
//
//
// ------------------------------------------------------
// 3. USER GET OWN PENDING ORDERS
// ------------------------------------------------------
//
// GET /api/orders/my-orders?status=Pending
//
//
// ------------------------------------------------------
// 4. USER GET OWN CONFIRMED ORDERS
// ------------------------------------------------------
//
// GET /api/orders/my-orders?status=Confirmed
//
//
// ------------------------------------------------------
// 5. USER GET OWN SHIPPED ORDERS
// ------------------------------------------------------
//
// GET /api/orders/my-orders?status=Shipped
//
//
// ------------------------------------------------------
// 6. USER GET OWN DELIVERED ORDERS
// ------------------------------------------------------
//
// GET /api/orders/my-orders?status=Delivered
//
//
// ------------------------------------------------------
// 7. USER GET OWN CANCELLED ORDERS
// ------------------------------------------------------
//
// GET /api/orders/my-orders?status=Cancelled
//
//
// ------------------------------------------------------
// 8. USER ORDERS - NEWEST FIRST
// ------------------------------------------------------
//
// GET /api/orders/my-orders?sortBy=createdAt&order=desc
//
//
// ------------------------------------------------------
// 9. USER ORDERS - OLDEST FIRST
// ------------------------------------------------------
//
// GET /api/orders/my-orders?sortBy=createdAt&order=asc
//
//
// ------------------------------------------------------
// 10. USER ORDERS - HIGHEST AMOUNT
// ------------------------------------------------------
//
// GET /api/orders/my-orders?sortBy=totalAmount&order=desc
//
//
// ------------------------------------------------------
// 11. USER ORDERS - LOWEST AMOUNT
// ------------------------------------------------------
//
// GET /api/orders/my-orders?sortBy=totalAmount&order=asc
//
//
// ======================================================
// ADMIN ORDER APIs
// ======================================================
//
//
// ------------------------------------------------------
// 12. ADMIN GET ALL ORDERS
// ------------------------------------------------------
//
// GET /api/orders
//
// Authorization:
// Bearer ADMIN_TOKEN
//
//
// ------------------------------------------------------
// 13. ADMIN SEARCH ORDERS
// ------------------------------------------------------
//
// Search by:
// - Customer name
// - Customer email
// - Product name
//
// GET /api/orders?search=Samsung
//
//
// ------------------------------------------------------
// 14. SEARCH BY CUSTOMER NAME
// ------------------------------------------------------
//
// GET /api/orders?search=John
//
//
// ------------------------------------------------------
// 15. SEARCH BY CUSTOMER EMAIL
// ------------------------------------------------------
//
// GET /api/orders?search=gmail.com
//
//
// ------------------------------------------------------
// 16. SEARCH BY PRODUCT NAME
// ------------------------------------------------------
//
// GET /api/orders?search=iPhone
//
//
// ------------------------------------------------------
// 17. CATEGORY-WISE ORDERS
// ------------------------------------------------------
//
// GET /api/orders?category=Electronics
//
//
// ------------------------------------------------------
// 18. CATEGORY-WISE SHOE ORDERS
// ------------------------------------------------------
//
// GET /api/orders?category=Shoes
//
//
// ------------------------------------------------------
// 19. PENDING ORDERS
// ------------------------------------------------------
//
// GET /api/orders?status=Pending
//
//
// ------------------------------------------------------
// 20. CONFIRMED ORDERS
// ------------------------------------------------------
//
// GET /api/orders?status=Confirmed
//
//
// ------------------------------------------------------
// 21. SHIPPED ORDERS
// ------------------------------------------------------
//
// GET /api/orders?status=Shipped
//
//
// ------------------------------------------------------
// 22. DELIVERED ORDERS
// ------------------------------------------------------
//
// GET /api/orders?status=Delivered
//
//
// ------------------------------------------------------
// 23. CANCELLED ORDERS
// ------------------------------------------------------
//
// GET /api/orders?status=Cancelled
//
//
// ------------------------------------------------------
// 24. ORDERS ABOVE A CERTAIN AMOUNT
// ------------------------------------------------------
//
// GET /api/orders?minAmount=5000
//
//
// ------------------------------------------------------
// 25. ORDERS BELOW A CERTAIN AMOUNT
// ------------------------------------------------------
//
// GET /api/orders?maxAmount=50000
//
//
// ------------------------------------------------------
// 26. ORDERS BETWEEN TWO AMOUNTS
// ------------------------------------------------------
//
// GET /api/orders?minAmount=1000&maxAmount=50000
//
//
// ------------------------------------------------------
// 27. NEWEST ORDERS
// ------------------------------------------------------
//
// GET /api/orders?sortBy=createdAt&order=desc
//
//
// ------------------------------------------------------
// 28. OLDEST ORDERS
// ------------------------------------------------------
//
// GET /api/orders?sortBy=createdAt&order=asc
//
//
// ------------------------------------------------------
// 29. HIGHEST ORDER AMOUNT
// ------------------------------------------------------
//
// GET /api/orders?sortBy=totalAmount&order=desc
//
//
// ------------------------------------------------------
// 30. LOWEST ORDER AMOUNT
// ------------------------------------------------------
//
// GET /api/orders?sortBy=totalAmount&order=asc
//
//
// ------------------------------------------------------
// 31. SORT BY PRODUCT NAME A-Z
// ------------------------------------------------------
//
// GET /api/orders?sortBy=product.name&order=asc
//
//
// ------------------------------------------------------
// 32. SORT BY CUSTOMER NAME A-Z
// ------------------------------------------------------
//
// GET /api/orders?sortBy=user.name&order=asc
//
//
// ------------------------------------------------------
// 33. CATEGORY + STATUS
// ------------------------------------------------------
//
// GET /api/orders?category=Electronics&status=Pending
//
//
// ------------------------------------------------------
// 34. SEARCH + STATUS
// ------------------------------------------------------
//
// GET /api/orders?search=Samsung&status=Delivered
//
//
// ------------------------------------------------------
// 35. SEARCH + CATEGORY
// ------------------------------------------------------
//
// GET /api/orders?search=Samsung&category=Electronics
//
//
// ------------------------------------------------------
// 36. SEARCH + CATEGORY + STATUS
// ------------------------------------------------------
//
// GET /api/orders?search=Samsung&category=Electronics&status=Pending
//
//
// ------------------------------------------------------
// 37. CATEGORY + AMOUNT RANGE
// ------------------------------------------------------
//
// GET /api/orders?category=Electronics&minAmount=10000&maxAmount=100000
//
//
// ------------------------------------------------------
// 38. CATEGORY + STATUS + SORT
// ------------------------------------------------------
//
// GET /api/orders?category=Electronics&status=Delivered&sortBy=totalAmount&order=desc
//
//
// ------------------------------------------------------
// 39. SEARCH + CATEGORY + STATUS + AMOUNT
// ------------------------------------------------------
//
// GET /api/orders?search=Samsung&category=Electronics&status=Delivered&minAmount=10000&maxAmount=100000
//
//
// ------------------------------------------------------
// 40. FULL ADMIN FILTER
// ------------------------------------------------------
//
// GET /api/orders?search=Samsung&category=Electronics&status=Pending&minAmount=10000&maxAmount=100000&sortBy=totalAmount&order=desc
//
//
// ======================================================
// ORDER STATUS UPDATE
// ======================================================
//
// 41. CONFIRM ORDER
//
// PUT /api/orders/:id/status
//
// Body:
// {
//   "status": "Confirmed"
// }
//
//
// 42. SHIP ORDER
//
// PUT /api/orders/:id/status
//
// Body:
// {
//   "status": "Shipped"
// }
//
//
// 43. DELIVER ORDER
//
// PUT /api/orders/:id/status
//
// Body:
// {
//   "status": "Delivered"
// }
//
//
// 44. CANCEL ORDER
//
// PUT /api/orders/:id/status
//
// Body:
// {
//   "status": "Cancelled"
// }
//
//
// ======================================================

export default router;
