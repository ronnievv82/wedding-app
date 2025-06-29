const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;



// 🔓 Enable CORS for all origins
app.use(cors());
app.use(express.json());

// 📂 Serve static files from /uploads via /gallery route
//app.use("/gallery", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// 📷 Configure multer to save as .jpg files
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const name = `photo_${Date.now()}.jpg`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// 📤 Photo upload route
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    console.error("No file received");
    return res.status(400).send("No photo uploaded");
  }
  console.log("✅ Uploaded:", req.file.filename);
  res.sendStatus(200);
});

// 🖼️ Gallery route: return list of .jpg files
app.get("/", (req, res) => {
  res.send("🎉 The gallery backend is live and ready!");
});


app.get("/api/gallery", (req, res) => {
  const folder = path.join(__dirname, "uploads");
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err);
      return res.status(500).send("Unable to load gallery");
    }
    const jpgs = files.filter(f => f.endsWith(".jpg"));
    res.json(jpgs.sort().reverse()); // newest first
  });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`📡 Server is running on port ${PORT}`);
});
