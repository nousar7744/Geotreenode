import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://rajatsonisoni77_db_user:xRDxzaIQzg1kpWcs@cluster0.rpxlyyl.mongodb.net/Cluster0";
    const dbName = process.env.DB_NAME || "users";
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      dbName: dbName,
    });

    console.log(`MongoDB connected ✅ : ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;