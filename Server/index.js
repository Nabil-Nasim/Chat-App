import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
dotenv.config()

const app = express()
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL

//Used for communication between servers
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

//To get cookies form the frontend.Acts as a middleware here
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)

const server = app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`)
})
mongoose.connect(databaseURL).then(() => {
    console.log("Database Connected Successfully")
}).catch(err => console.log(err))