import express from "express";
import {
  register,
  login,
  allFetch,
  fetch,
  update,
  deletes,
  forgotPassword,
  resetPassword,
} from "../controlers/userControlers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { generalLimiter, loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", generalLimiter, register);
router.post("/login", login);
router.get("/", generalLimiter, allFetch);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
(router.get("/:id", generalLimiter, fetch),
  router.put("/:id", generalLimiter, authMiddleware, update));
router.delete("/:id", authMiddleware, deletes);

export default router;
