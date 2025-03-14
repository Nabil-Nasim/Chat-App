import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import setupSocket from "./socket.js";
dotenv.config()

const app = express()
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "https://chat-app-frontend-omega-wine.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// Regular CORS for other requests
app.use(cors({
  origin: process.env.ORIGIN || "https://chat-app-frontend-omega-wine.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "X-CSRF-Token"]
}));



//app.use("/uploads/profiles", ...): Sets up a URL path for accessing the static files.
//express.static("uploads/profiles"): Tells Express where to find those files on the server.
app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))

//To get cookies form the frontend.Acts as a middleware here
app.use(cookieParser())
app.use(express.json())





app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/channel", channelRoutes)
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

setupSocket(server)

mongoose.connect(databaseURL).then(() => {
    console.log("Database Connected Successfully")
}).catch(err => console.log(err))
