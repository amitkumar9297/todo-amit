import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.utils";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

    user.tokens.push(accessToken);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Refresh token required" });

  const decoded = verifyToken(token, "75WayTech");
  if (!decoded) return res.status(403).json({ message: "Invalid token" });

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token)
    return res.status(403).json({ message: "Invalid refresh token" });

  const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
  user.tokens.push(newAccessToken);
  await user.save();

  res.status(200).json({ accessToken: newAccessToken });
};