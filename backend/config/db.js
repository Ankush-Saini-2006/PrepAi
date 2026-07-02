const dns = require("dns");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
        // If the connection fails due to DNS resolution / querySrv issue, set public DNS and retry
    if (
      error.message.includes("querySrv") ||
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.warn(`⚠️ MongoDB DNS/SRV error detected: ${error.message}`);
      console.log("🔄 Retrying connection using public DNS servers...");
      try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected (via Public DNS): ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error(`❌ MongoDB Connection Error (after DNS retry): ${retryError.message}`);
      }
    } else {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
