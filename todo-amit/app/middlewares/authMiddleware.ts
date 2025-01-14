import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.utils";
import User, { IUser } from "../models/user.model"
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access token required" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = verifyToken(token, "your_access_token_secret");
    if (!decoded) return res.status(403).json({ message: "Invalid or expired token" });

    const user = await User.findById(decoded.id);
    if (!user || !user.tokens.includes(token))
      return res.status(403).json({ message: "Invalid session" });

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(403).json({ message: "Unauthorized" });
  }
};