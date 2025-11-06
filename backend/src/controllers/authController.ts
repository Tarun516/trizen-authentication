import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Otp } from "../models/otp.model";
import { sendEmail } from "../utils/sendEmail";

// 5 minutes expiry time
const OTP_EXPIRY_TIME = 5;

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// signup handler
export const signup = async (req: Request, res: Response) => {
  try {
    console.log("REQ BODY:", req.body);

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await user.save();

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME * 60 * 1000);

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    await sendEmail(
      email,
      "Verify your email",
      `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    );

    return res.status(201).json({
      message: "Signup successful. OTP sent to email.",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (existingOtp.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: existingOtp._id });
      return res.status(400).json({ message: "OTP Expired" });
    }

    // mark user verified
    await User.updateOne(
      { email },
      {
        $set: {
          isVerified: true,
        },
      }
    );

    // delete otp after verification
    await Otp.deleteOne({ _id: existingOtp._id });

    // auto-login user after verification
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // access token creation
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    // refresh token creation
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Email verified succesfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// signin handler
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Signin successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout handler
export const logout = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await User.updateOne({ email }, { $unset: { refreshToken: "" } });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
