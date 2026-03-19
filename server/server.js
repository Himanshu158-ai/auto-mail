import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import mailRoutes from "./routes/mail.routes.js"

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // update this if your frontend runs on a different port
  credentials: true
}));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute per user
  message: {
    success: false,
    message: "Too many requests, please try again after a minute",
  },
});
app.use("/api/mail", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail",mailRoutes);

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "College Mail AI Server Running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});