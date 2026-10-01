import {
  deleteUser,
  getAllUser,
  getUser,
  loginUser,
  registerUser,
  updateUser,
  forgotPasswordService,
  resetPasswordService,
} from "../services/userServices.js";

export const register = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    if (!name || !age || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all filds are required" });
    }
    if (
      !Number.isInteger(Number(age)) ||
      Number(age) < 1 ||
      Number(age) > 130
    ) {
      return res
        .status(400)
        .json({ success: false, message: "enter a valid age " });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "passwod minimum 6 characters" });
    }

    const user = await registerUser(name, age, email, password);

    res
      .status(201)
      .json({ success: true, message: "register successful", user });
  } catch (error) {
    if (error.message === "email already exist") {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all filds are required" });
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      token: result.token,
      message: "login sucessfful",
      user: result.data,
    });
    //  user: result.data,
  } catch (error) {
    if (error.message === "invalid") {
      return res.status(401).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allFetch = async (req, res) => {
  try {
    const result = await getAllUser({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,

      minAge: req.query.minAge,
      maxAge: req.query.maxAge,

      sortBy: req.query.sortBy,
      order: req.query.order,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// FORGOT PASSWORD CONTROLLER
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await forgotPasswordService(email);

    return res.status(200).json({
      success: true,
      message: "Password reset link generated",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// RESET PASSWORD CONTROLLER
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    await resetPasswordService(token, password);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Invalid or expired reset token") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const fetch = async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, message: "fetch succcesful", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    const user = await updateUser(req.params.id, name, age, email, password);
    res.status(200).json({ success: true, message: "update sucessful", user });
  } catch (error) {
    if (error.message === "user not found") {
      res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletes = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ success: false, message: "user deleted" });
  } catch (error) {
    if (error.message === "user not found") {
      res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message`` });
  }
};
