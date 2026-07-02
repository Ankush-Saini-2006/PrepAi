const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const PLACEHOLDER_VALUES = new Set([
  "",
  "your_cloud_name",
  "your_api_key",
  "your_api_secret",
]);

const isCloudinaryConfigured = () => {
  const values = [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ].map((value) => value?.trim() || "");

  return values.every((value) => !PLACEHOLDER_VALUES.has(value));
};

const getPublicBaseUrl = () => {
  return process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
};

const useLocalUpload = (filePath) => {
  const filename = path.basename(filePath);
  return {
    url: `${getPublicBaseUrl()}/uploads/${filename}`,
    publicId: `local:${filename}`,
    storage: "local",
  };
};

/**
 * Upload a local file to Cloudinary when configured.
 * Falls back to the local uploads folder for development when Cloudinary
 * credentials are missing or rejected.
 */
const uploadToCloudinary = async (filePath, folder = "prepai") => {
  if (!isCloudinaryConfigured()) {
    console.log("Cloudinary not configured. Using local file storage for upload.");
    return useLocalUpload(filePath);
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete local file:", err.message);
    });

    return { url: result.secure_url, publicId: result.public_id, storage: "cloudinary" };
  } catch (error) {
    console.log(error.message);
    if (error.http_code === 401 || error.http_code === 403) {
      console.log("Cloudinary credentials rejected. Using local file storage for upload.");
      return useLocalUpload(filePath);
    }
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  if (publicId.startsWith("local:")) {
    const filename = publicId.replace("local:", "");
    const filePath = path.join(__dirname, "..", "uploads", filename);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Failed to delete local upload:", err.message);
      }
    });
    return null;
  }
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
