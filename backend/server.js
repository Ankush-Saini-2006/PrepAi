require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const handleServerError = (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Stop the existing backend process or change PORT in backend/.env.`);
    process.exit(1);
  }

  throw error;
};

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 PrepAI server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });

  server.on("error", handleServerError);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
