const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ApiError = require("../utils/ApiError");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const getGeminiApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new ApiError(
      500,
      "GEMINI_API_KEY is missing. Set it in backend/.env and restart the backend."
    );
  }

  return apiKey;
};

const getGeminiModel = () => {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());

  // Use model from .env or default to latest Flash model
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  console.log("Using Gemini Model:", modelName);

  return genAI.getGenerativeModel({
    model: modelName,
  });
};

module.exports = {
  getGeminiApiKey,
  getGeminiModel,
};