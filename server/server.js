const fs = require("fs");
const https = require("https");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Replace these with your actual cert paths
const options = {
  key: fs.readFileSync("/ssl/cert.pem"),
  cert: fs.readFileSync("/ssl/key.pem"),
};

// Test route (optional)
app.get("/", (req, res) => {
  res.send("✅ HTTPS server is live!");
});

// Upload endpoint
app.post("/api/upload", upload.single("photo"), (req, res) => {
  console.log("� Received upload:", req.file.originalname);
  res.status(200).json({ message: "Upload successful!" });
});

// Launch server
https.createServer(options, app).listen(3001, () => {
  console.log("� HTTPS server running at https://ronnievv.duckdns.org:3001");
