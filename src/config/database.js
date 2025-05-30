const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Namastedev:MYxB3puJo46kMR6G@namastebackend.yosugcr.mongodb.net/devTinder");
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectDB ();

module.exports={connectDB};
