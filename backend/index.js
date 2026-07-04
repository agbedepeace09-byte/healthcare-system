try {
  require("dotenv").config();
} catch {} // dotenv is optional
const express = require("express");
const cors = require("cors");

// Import the modular routers
const labRoutes = require("./routes/labRoutes");

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// MOUNT ROUTES
// ==========================================
app.use("/api/labs", labRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
