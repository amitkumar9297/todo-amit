import { Router } from "express";
// import  { login } from "../controllers/login.controller";
import { login, refreshToken } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

export default router;