const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ApiError = require("../utils/ApiError");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const getGeminiApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  console.log("GEMINI KEY:", !!apiKey);

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

  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
};

module.exports = { getGeminiApiKey, getGeminiModel };
