const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: "https://ronnievv.netlify.app"
}));
app.use(express.json());

// Serve static photos from the uploads folder
app.use("/gallery", express.static(path.join(__dirname, "uploads")));

// Multer config with filename
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const name = `photo_${Date.now()}.jpg`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// Photo upload endpoint
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    console.error("No file received");
    return res.status(400).send("No file uploaded");
  }
  console.log("📸 Saved:", req.file.filename);
  res.sendStatus(200);
});

// API route to list uploaded photos
app.get("/api/gallery", (req, res) => {
  const dir = path.join(__dirname, "uploads");
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading uploads:", err);
      return res.status(500).send("Unable to load gallery");
    }
    const jpgs = files.filter(name => name.endsWith(".jpg"));
    res.json(jpgs.sort().reverse()); // Newest first
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
