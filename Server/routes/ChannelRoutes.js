import { Router } from "express";
import {createChannel, getUserChannel,getChannelMessages} from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channel", verifyToken, getUserChannel);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);
export default channelRoutes;