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

//Used for communication between servers
app.use(cors({
  origin: process.env.ORIGIN || "https://chat-app-frontend-omega-wine.vercel.app",
  methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  allowedHeaders: ["X-CSRF-Token", "X-Requested-With", "Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Api-Version"],
  credentials: true,
}));




//app.use("/uploads/profiles", ...): Sets up a URL path for accessing the static files.
//express.static("uploads/profiles"): Tells Express where to find those files on the server.
app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))

//To get cookies form the frontend.Acts as a middleware here
app.use(cookieParser())
app.use(express.json())
app.options("*", cors());




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
