import { Router } from "express";
// import  { login } from "../controllers/login.controller";
import { adminRegister, login, refreshToken, userRegister } from "../controllers/auth.controller";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/admin-register", isAdmin, adminRegister);

router.post("/user-register", userRegister);

export default router;