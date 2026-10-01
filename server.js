import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/prroductRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", async (req, res) => {
  res.json({ success: true, message: "get successful" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on the port ${PORT}`);
});
