import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { Otp } from "../models/otp.model";
import { sendEmail } from "../utils/sendEmail";
import { createTokens } from "../utils/createTokens";

const OTP_EXPIRY_TIME = 5;

// signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME * 60 * 1000);
    await Otp.create({ email, otp, expiresAt });

    await sendEmail(
      email,
      "Verify your email",
      `<p>Your OTP is <b>${otp}</b>.</p>`
    );
    return res.status(201).json({ message: "Signup successful. OTP sent." });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// verify otp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP
    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP expired
    const now = new Date();
    if (existingOtp.expiresAt < now) {
      await Otp.deleteOne({ _id: existingOtp._id });
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    // Mark user verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: existingOtp._id });

    // Generate access token and persist
    const { accessToken } = createTokens(user);
    user.refreshToken = accessToken;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      accessToken,
    });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// signin
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken } = createTokens(user);
    user.refreshToken = accessToken;
    await user.save();

    return res.status(200).json({ accessToken });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await User.updateOne({ email }, { $unset: { refreshToken: 1 } });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
