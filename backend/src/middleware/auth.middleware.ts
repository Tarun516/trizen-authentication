import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

// verify Access Token
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded; // Attach decoded user data to request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

//  role-based Access Control
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. User not found in request." });
      }

      // Example usage: authorizeRoles("admin")
      const hasAccess = allowedRoles.some((role) =>
        role === "admin" ? user.isAdmin : false
      );

      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error) {
      console.error("Authorization Error:", error);
      res.status(500).json({ message: "Server error in authorization." });
    }
  };
};
