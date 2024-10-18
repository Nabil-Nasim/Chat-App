import {
    Router
} from "express";
import {
    signUp
} from "../controllers/AuthController.js";
import {
    login
} from "../controllers/AuthController.js";

const authRoutes = Router();
authRoutes.post("/signup", signUp)
authRoutes.post("/login", login)
export default authRoutes