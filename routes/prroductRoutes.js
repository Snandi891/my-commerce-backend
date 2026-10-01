import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controlers/productControlers.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ======================================================
// PUBLIC PRODUCT ROUTES
// ======================================================

// Get all products
// Supports search, category, price, status and sorting
router.get("/", getAll);

// Get single product by ID
router.get("/:id", getOne);

// ======================================================
// ADMIN PRODUCT ROUTES
// ======================================================

// Create product
router.post("/", authMiddleware, adminMiddleware, create);

// Update product
router.put("/:id", authMiddleware, adminMiddleware, update);

// Delete product
router.delete("/:id", authMiddleware, adminMiddleware, remove);

// ======================================================
// PRODUCT API EXAMPLES
// ======================================================
//
// Base URL:
// /api/products
//
//
// 1. GET ALL PRODUCTS
// GET /api/products
//
//
// 2. SEARCH PRODUCT BY NAME OR BRAND
// GET /api/products?search=Samsung
//
//
// 3. CATEGORY-WISE PRODUCTS
// GET /api/products?category=Electronics
//
//
// 4. CATEGORY + SEARCH
// GET /api/products?category=Electronics&search=Samsung
//
//
// 5. SEARCH BY BRAND
// GET /api/products?search=Nike
//
//
// 6. ACTIVE PRODUCTS
// GET /api/products?status=active
//
//
// 7. INACTIVE PRODUCTS
// GET /api/products?status=inactive
//
//
// 8. MINIMUM PRICE
// GET /api/products?minPrice=1000
//
//
// 9. MAXIMUM PRICE
// GET /api/products?maxPrice=50000
//
//
// 10. PRICE RANGE
// GET /api/products?minPrice=1000&maxPrice=50000
//
//
// 11. SORT BY NAME A-Z
// GET /api/products?sortBy=name&order=asc
//
//
// 12. SORT BY NAME Z-A
// GET /api/products?sortBy=name&order=desc
//
//
// 13. LOWEST PRICE FIRST
// GET /api/products?sortBy=price&order=asc
//
//
// 14. HIGHEST PRICE FIRST
// GET /api/products?sortBy=price&order=desc
//
//
// 15. LOWEST STOCK FIRST
// GET /api/products?sortBy=stock&order=asc
//
//
// 16. HIGHEST STOCK FIRST
// GET /api/products?sortBy=stock&order=desc
//
//
// 17. HIGHEST RATING FIRST
// GET /api/products?sortBy=rating&order=desc
//
//
// 18. NEWEST PRODUCTS
// GET /api/products?sortBy=createdAt&order=desc
//
//
// 19. OLDEST PRODUCTS
// GET /api/products?sortBy=createdAt&order=asc
//
//
// 20. CATEGORY + PRICE RANGE
// GET /api/products?category=Laptops&minPrice=30000&maxPrice=80000
//
//
// 21. CATEGORY + SORT
// GET /api/products?category=Shoes&sortBy=price&order=asc
//
//
// 22. CATEGORY + SEARCH + SORT
// GET /api/products?category=Electronics&search=Samsung&sortBy=price&order=asc
//
//
// 23. CATEGORY + STATUS
// GET /api/products?category=Shoes&status=active
//
//
// 24. SEARCH + PRICE RANGE
// GET /api/products?search=Apple&minPrice=20000&maxPrice=100000
//
//
// 25. SEARCH + STATUS
// GET /api/products?search=Nike&status=active
//
//
// 26. CATEGORY + PRICE + SORT
// GET /api/products?category=Electronics&minPrice=10000&maxPrice=80000&sortBy=price&order=asc
//
//
// 27. CATEGORY + SEARCH + PRICE + SORT
// GET /api/products?category=Electronics&search=Samsung&minPrice=10000&maxPrice=100000&sortBy=price&order=asc
//
//
// 28. GET SINGLE PRODUCT
// GET /api/products/:id
//
// Example:
// GET /api/products/68c123456789abcdef123456
//
//
// ======================================================
// ADMIN ONLY APIs
// ======================================================
//
// 29. CREATE PRODUCT
// POST /api/products
// Authorization: Bearer <admin-token>
//
//
// 30. UPDATE PRODUCT
// PUT /api/products/:id
// Authorization: Bearer <admin-token>
//
//
// 31. DELETE PRODUCT
// DELETE /api/products/:id
// Authorization: Bearer <admin-token>
// ======================================================

export default router;
