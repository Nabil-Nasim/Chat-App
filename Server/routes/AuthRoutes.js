import {
    Router
} from "express";
import {
    signUp,
    login,
    getUserInfo,
    updateProfile
} from "../controllers/AuthController.js";
import {
    verifyToken
} from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();
authRoutes.post("/signup", signUp)
authRoutes.post("/login", login)
authRoutes.get("/user-info", verifyToken, getUserInfo)
authRoutes.post("/update-profile", verifyToken, updateProfile)
export default authRoutes