import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MONGODB connection FAILED", err);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
