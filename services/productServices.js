import Product from "../models/Product.js";

// CREATE
export const createProduct = async (productData) => {
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
  } = productData;

  const product = await Product.create({
    name: name.trim(),
    category: category.trim(),
    brand: brand?.trim() || "",

    price: Number(price),
    salePrice:
      salePrice !== undefined && salePrice !== null && salePrice !== ""
        ? Number(salePrice)
        : null,

    discount: Number(discount) || 0,

    description: description.trim(),
    image: image?.trim() || "",

    stock: Number(stock) || 0,

    sku: sku?.trim() || undefined,

    status: status || "active",

    rating: Number(rating) || 0,
    reviews: Number(reviews) || 0,

    specifications: specifications || {},
  });

  return product;
};

// GET ALL / SEARCH / CATEGORY FILTER
export const getProducts = async ({
  search,
  category,
  status,
  minPrice,
  maxPrice,
  sortBy = "createdAt",
  order = "desc",
} = {}) => {
  const filter = {};

  // Search by product name or brand
  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  // Category-wise search/filter
  if (category) {
    filter.category = {
      $regex: `^${category.trim()}$`,
      $options: "i",
    };
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Minimum price
  if (minPrice !== undefined && minPrice !== "") {
    filter.price = {
      ...filter.price,
      $gte: Number(minPrice),
    };
  }

  // Maximum price
  if (maxPrice !== undefined && maxPrice !== "") {
    filter.price = {
      ...filter.price,
      $lte: Number(maxPrice),
    };
  }

  // Allowed sorting fields
  const allowedSortFields = [
    "name",
    "price",
    "salePrice",
    "stock",
    "rating",
    "createdAt",
  ];

  const selectedSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const selectedOrder = order === "asc" ? 1 : -1;

  const products = await Product.find(filter).sort({
    [selectedSortField]: selectedOrder,
  });

  return products;
};

// GET ONE
export const getProductById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("product not found");
  }

  return product;
};

// UPDATE
export const updateProduct = async (id, productData) => {
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
  } = productData;

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("product not found");
  }

  if (name !== undefined) {
    product.name = name.trim();
  }

  if (category !== undefined) {
    product.category = category.trim();
  }

  if (brand !== undefined) {
    product.brand = brand.trim();
  }

  if (price !== undefined) {
    product.price = Number(price);
  }

  if (salePrice !== undefined) {
    product.salePrice =
      salePrice === null || salePrice === "" ? null : Number(salePrice);
  }

  if (discount !== undefined) {
    product.discount = Number(discount);
  }

  if (description !== undefined) {
    product.description = description.trim();
  }

  if (image !== undefined) {
    product.image = image.trim();
  }

  if (stock !== undefined) {
    product.stock = Number(stock);
  }

  if (sku !== undefined) {
    product.sku = sku.trim() || undefined;
  }

  if (status !== undefined) {
    product.status = status;
  }

  if (rating !== undefined) {
    product.rating = Number(rating);
  }

  if (reviews !== undefined) {
    product.reviews = Number(reviews);
  }

  if (specifications !== undefined) {
    product.specifications = specifications;
  }

  await product.save();

  return product;
};

// DELETE
export const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("product not found");
  }

  await Product.findByIdAndDelete(id);

  return product;
};
