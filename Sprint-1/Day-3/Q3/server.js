require("dotenv").config(); // Load environment variables

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; // Use Cloudinary v2
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Delete the file from local uploads folder
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
});

app.listen(4050, () => {
  console.log("Server running on port 4050");
});
