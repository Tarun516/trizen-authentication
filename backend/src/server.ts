import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./db/db"; // ✅ Should be a default export

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// 🧠 Middleware setup
app.use(cors()); // Enables cross-origin requests
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses form data

// 🧩 Connect to MongoDB
connectDB();

// 🛣️ API Routes
app.use("/api/auth", authRoutes);

// 🩺 Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running and healthy!");
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
