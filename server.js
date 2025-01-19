const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const studentRouter = require("./routes/students");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8001;
const DATABASE_URL = process.env.DATABASE_URL; // MongoDB connection URL

// Connect to MongoDB
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Database Connection Established"));

// Middleware
app.use(cors({ origin: "https://awdcrudapi-8114b17bc334.herokuapp.com" })); // Frontend URL
app.use(express.json());

// API Routes
app.use("/students", studentRouter);

// Serve Static Files (if applicable)
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
