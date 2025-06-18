const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Namastedev:I9QpkF5BQym26Vgx@namastebackend.yosugcr.mongodb.net/"
     );
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectDB();

module.exports = { connectDB };
