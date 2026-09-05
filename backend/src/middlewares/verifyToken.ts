import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "string" || !decoded.userId) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (e) {
    // Expired/invalid tokens are an auth failure (401), not a server
    // failure (500) - the previous code returned 500 here, which the
    // project's own status-code convention (backend/readme..md) reserves
    // for "no valid token".
    return res.status(401).json({ message: "Failed to authenticate token" });
  }
};
