import axios from "axios";
const BASE_URL = "http://192.168.0.104:4000/api/auth";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = (email: string, password: string) =>
  api.post("/signup", { email, password });

export const verifyOtp = (email: string, otp: string) =>
  api.post("/verify-otp", { email, otp });

export const signin = (email: string, password: string) =>
  api.post("/signin", { email, password });

export const logout = (email: string) => api.post("/logout", { email });
