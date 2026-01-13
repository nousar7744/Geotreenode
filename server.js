import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Auth } from "./Routers/Auth.route.js";

dotenv.config();
mongoose.set("bufferCommands", true);

const app = express();

// ✅ CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ START SERVER FUNCTION
async function startServer() {
  try {
    // ✅ WAIT FOR DB
    await connectDB();

    // ✅ ROUTES AFTER DB
    app.use(Auth);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    app.on('error', (error) => {
      console.error('❌ Server Error:', error);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ✅ START SERVER
startServer();
