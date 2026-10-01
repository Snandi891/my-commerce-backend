import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const registerUser = async (name, age, email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("email already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    age: Number(age),
    email: normalizedEmail,
    password: hashedPassword,
  });
  return {
    id: user._id,
    name: user.name,
    age: user.age,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new Error("invalid");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new Error("invalid");
  }

  return {
    token: token,
    data: {
      id: user._id,
      name: user.name,
      age: user.age,
      email: user.email,
      role: user.role,
    },
  };
};

export const getAllUser = async ({
  page,
  limit,
  search,
  minAge,
  maxAge,
  sortBy,
  order,
}) => {
  // =========================
  // FILTER
  // ========================

  let filter = {};

  // Search by name
  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Age filter
  if (minAge || maxAge) {
    filter.age = {};

    if (minAge) {
      filter.age.$gte = Number(minAge);
    }

    if (maxAge) {
      filter.age.$lte = Number(maxAge);
    }
  }

  // =========================
  // SORT
  // =========================

  let sort = {};

  if (sortBy) {
    sort[sortBy] = order === "desc" ? -1 : 1;
  }

  // =========================
  // ALL USERS
  // =========================

  if (page === undefined && limit === undefined) {
    const users = await User.find(filter).select("-password").sort(sort);

    return {
      type: "all",
      totalUsers: users.length,
      data: users,
    };
  }

  // =========================
  // PAGINATION
  // =========================

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;

  if (currentPage < 1 || currentLimit < 1) {
    throw new Error("Page and limit must be greater than 0");
  }

  const skip = (currentPage - 1) * currentLimit;

  const users = await User.find(filter)
    .select("-password")
    .sort(sort)
    .skip(skip)
    .limit(currentLimit);

  const totalUsers = await User.countDocuments(filter);

  const totalPages = Math.ceil(totalUsers / currentLimit);

  return {
    type: "pagination",
    page: currentPage,
    limit: currentLimit,
    totalUsers,
    totalPages,
    data: users,
  };
};

// ===============================
// FORGOT PASSWORD
// ===============================
export const forgotPasswordService = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Only normal users can use forgot password
  if (user.role !== "user") {
    throw new Error("Admin password reset is not allowed");
  }

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Token expires after 15 minutes
  const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetPasswordExpires;

  await user.save();

  // For testing with Thunder Client
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  console.log("RESET LINK:", resetLink);

  return {
    resetToken,
    resetLink,
  };
};
// ===============================
// RESET PASSWORD
// ===============================
export const resetPasswordService = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,

    resetPasswordExpires: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  // Remove reset token after successful reset
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  return true;
};

export const getUser = async (id) => {
  return await User.findById(id).select("-password");
};

export const updateUser = async (id, name, age, email, password) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("user not found");
  }

  if (name !== undefined) {
    user.name = name.trim();
  }

  if (age !== undefined) {
    user.age = Number(age);
  }

  if (email !== undefined) {
    user.email = email.trim().toLowerCase();
  }

  if (password !== undefined) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    age: user.age,
    email: user.email,
  };
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error("user not found");
  }

  return user;
};
