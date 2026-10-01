import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productServices.js";

// CREATE PRODUCT
export const create = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      salePrice,
      discount,
      description,
      image,
      stock,
      sku,
      status,
      rating,
      reviews,
      specifications,
    } = req.body;

    // Required fields
    if (!name || price === undefined || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "name, price, description and category are required",
      });
    }

    // Price validation
    if (Number.isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "price must be a valid positive number",
      });
    }

    // Sale price validation
    if (
      salePrice !== undefined &&
      salePrice !== null &&
      salePrice !== "" &&
      (Number.isNaN(Number(salePrice)) || Number(salePrice) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "salePrice must be a valid positive number",
      });
    }

    // Stock validation
    if (
      stock !== undefined &&
      (Number.isNaN(Number(stock)) || Number(stock) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "stock must be a valid positive number",
      });
    }

    // Discount validation
    if (
      discount !== undefined &&
      (Number.isNaN(Number(discount)) ||
        Number(discount) < 0 ||
        Number(discount) > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "discount must be between 0 and 100",
      });
    }

    // Rating validation
    if (
      rating !== undefined &&
      (Number.isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "rating must be between 0 and 5",
      });
    }

    const product = await createProduct({
      name,
      category,
      brand,
      price,
      salePrice,
      discount,
      description,
      image,
      stock,
      sku,
      status,
      rating,
      reviews,
      specifications,
    });

    return res.status(201).json({
      success: true,
      message: "product created successfully",
      product,
    });
  } catch (error) {
    // Duplicate name or SKU
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message:
          duplicateField === "sku"
            ? "SKU already exists"
            : "Product already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
// Supports:
// ?search=Samsung
// ?category=Electronics
// ?status=active
// ?minPrice=1000
// ?maxPrice=50000
// ?sortBy=price
// ?order=asc
export const getAll = async (req, res) => {
  try {
    const { search, category, status, minPrice, maxPrice, sortBy, order } =
      req.query;

    const products = await getProducts({
      search,
      category,
      status,
      minPrice,
      maxPrice,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      filters: {
        search: search || "",
        category: category || "",
        status: status || "",
        minPrice: minPrice || "",
        maxPrice: maxPrice || "",
        sortBy: sortBy || "createdAt",
        order: order || "desc",
      },
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getOne = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.message === "product not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
export const update = async (req, res) => {
  try {
    const { price, salePrice, discount, stock, rating, reviews } = req.body;

    // Validate price
    if (
      price !== undefined &&
      (Number.isNaN(Number(price)) || Number(price) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "price must be a valid positive number",
      });
    }

    // Validate sale price
    if (
      salePrice !== undefined &&
      salePrice !== null &&
      salePrice !== "" &&
      (Number.isNaN(Number(salePrice)) || Number(salePrice) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "salePrice must be a valid positive number",
      });
    }

    // Validate stock
    if (
      stock !== undefined &&
      (Number.isNaN(Number(stock)) || Number(stock) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "stock must be a valid positive number",
      });
    }

    // Validate discount
    if (
      discount !== undefined &&
      (Number.isNaN(Number(discount)) ||
        Number(discount) < 0 ||
        Number(discount) > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "discount must be between 0 and 100",
      });
    }

    // Validate rating
    if (
      rating !== undefined &&
      (Number.isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "rating must be between 0 and 5",
      });
    }

    const product = await updateProduct(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    // Product not found
    if (error.message === "product not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // Duplicate SKU/name
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message:
          duplicateField === "sku"
            ? "SKU already exists"
            : "Product already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const remove = async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);

    return res.status(200).json({
      success: true,
      message: "product deleted successfully",
      product,
    });
  } catch (error) {
    if (error.message === "product not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
