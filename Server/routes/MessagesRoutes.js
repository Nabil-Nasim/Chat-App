import Router from "express";
import { getMessages,uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"

const messagesRoutes = Router();
// const upload = multer({ dest: 'uploads/files' }) ( For Local Host)
const upload = multer({
    dest: "/tmp/uploads/files"  //For Vercel Deployment
});
messagesRoutes.post("/get-messages",verifyToken, getMessages);
messagesRoutes.post("/upload-file",verifyToken, upload.single("file"), uploadFile);

export default messagesRoutes;
