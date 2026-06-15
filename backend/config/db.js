const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️  MONGO_URI is not defined. Skipping MongoDB connection.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are not needed in Mongoose 8+ but kept for clarity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

// Handle mongoose disconnection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ Mongoose error: ${err.message}`);
});

module.exports = connectDB;
