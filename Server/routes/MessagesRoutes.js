import Router from "express";
import { getMessages,uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"

const messagesRoutes = Router();
// const upload = multer({ dest: 'uploads/files' })
const upload = multer({
    dest: "/tmp/uploads/files"  // Use /tmp for file uploads
});
messagesRoutes.post("/get-messages",verifyToken, getMessages);
messagesRoutes.post("/upload-file",verifyToken, upload.single("file"), uploadFile);

export default messagesRoutes;
