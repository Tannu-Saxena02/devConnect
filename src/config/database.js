const mongoose = require("mongoose");


const connectDB = async () => {
  try {  
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

module.exports = { connectDB };
