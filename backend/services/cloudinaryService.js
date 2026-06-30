const fs = require("fs");
const cloudinary = require("../config/cloudinary");

/**
 * Upload a local file to Cloudinary and remove the local copy.
 */
const uploadToCloudinary = async (filePath, folder = "prepai") => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });

  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete local file:", err.message);
  });

  return { url: result.secure_url, publicId: result.public_id };
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
