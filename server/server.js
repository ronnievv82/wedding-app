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

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = ".jpg";
    const name = `photo_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });



const path = require("path");
app.use("/gallery", express.static(path.join(__dirname, "uploads")));




// Replace these with your actual cert paths
const options = {
  key: fs.readFileSync("../ssl/key.pem"),
  cert: fs.readFileSync("../ssl/cert.pem"),
};

// Test route (optional)
app.get("/", (req, res) => {
  res.send("✅ HTTPS server is live!");
});

// Upload endpoint
app.post("/uploads", upload.single("photo"), (req, res) => {
  console.log("� Received upload:", req.file.originalname);
  res.status(200).json({ message: "Upload successful!" });
});

// Launch server
https.createServer(options, app).listen(3001, () => {
  console.log("� HTTPS server running at https://ronnievv.duckdns.org:3001");
});
