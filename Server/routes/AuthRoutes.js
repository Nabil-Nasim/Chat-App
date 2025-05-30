import {
    Router
} from "express";
import {
    signUp,
    login,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logout
} from "../controllers/AuthController.js";
import {
    verifyToken
} from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
// const upload = multer({
//     dest: "uploads/profiles/"
// }) ( For Local Host)
const upload = multer({
    dest: "/tmp/uploads/profiles/"  // Use the /tmp directory for AWS Lambda or similar environments
}); // For Vercel Deployment

authRoutes.post("/signup", signUp)
authRoutes.post("/login", login)
authRoutes.get("/user-info", verifyToken, getUserInfo)
authRoutes.post("/update-profile", verifyToken, updateProfile)
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage)
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
authRoutes.post("/logout", logout)
export default authRoutes
