import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.utils";
import { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model"
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = verifyToken(token, "75Way");

    if (!decoded || typeof decoded === "string") {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.tokens.includes(token)) {
      res.status(403).json({ message: "Invalid session" });
      return;
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    res.status(403).json({ message: "Unauthorized" });
  }
};