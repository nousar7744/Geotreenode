import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Auth } from "./Routers/Auth.route.js";

dotenv.config();
mongoose.set("bufferCommands", true);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ WAIT FOR DB
await connectDB();

// ✅ ROUTES AFTER DB
app.use(Auth);

app.listen(3002, () => {
  console.log("🚀 Server running on PORT 3002");
});
