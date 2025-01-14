import { User } from "../models/user.model"; // Assuming you have a User model

declare global {
  namespace Express {
    interface Request {
      user: User; // Define user property type
    }
  }
}