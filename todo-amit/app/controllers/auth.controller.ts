import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.utils";

export const login = async (req: Request, res: Response,next: NextFunction): Promise<void>  => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user){res.status(404).json({ message: "User not found" }); return}

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {res.status(401).json({ message: "Invalid credentials" }); return}

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
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: "Refresh token required" });
      return;
    }

    const decoded = verifyToken(token, "75WayTech");

    if (!decoded || typeof decoded === "string") {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
    user.tokens.push(newAccessToken);
    await user.save();

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error); // Pass the error to Express error handling middleware
  }
};

export const adminRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password, role } = req.body;

  try {
    // Only admin can assign the role of 'admin'
    if (role && role !== "admin" && role !== "user") {
      res.status(400).json({ message: "Invalid role. Only 'admin' or 'user' are allowed" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if no role is specified
      tokens: [],
      refreshToken: "",
    });

    // Save the user to the database
    await newUser.save();

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ id: newUser._id, role: newUser.role });
    const refreshToken = generateRefreshToken({ id: newUser._id, role: newUser.role });

    // Save the tokens in the user's document
    newUser.tokens.push(accessToken);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Respond with the tokens
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error); // Pass the error to Express error handling middleware
  }
};

export const userRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role is 'user'
      tokens: [],
      refreshToken: "",
    });

    // Save the user to the database
    await newUser.save();

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ id: newUser._id, role: newUser.role });
    const refreshToken = generateRefreshToken({ id: newUser._id, role: newUser.role });

    // Save the tokens in the user's document
    newUser.tokens.push(accessToken);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Respond with the tokens
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error); // Pass the error to Express error handling middleware
  }
};