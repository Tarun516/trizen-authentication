import express from "express";
import {
  signup,
  signin,
  verifyOtp,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);
router.post("/logout", logout);

export default router;
