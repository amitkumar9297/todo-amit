import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    return next(); // Continue to the next middleware or route handler
  }
  res.status(403).json({ message: "Forbidden: You are not an admin" });
};