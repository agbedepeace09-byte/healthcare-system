require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import the modular routers
const authRoutes = require("./routes/auth");
const consultationsRoutes = require("./routes/consultations");
const labRoutes = require("./routes/lab");
const patientsRoutes = require("./routes/patients");
const pharmacyRoutes = require("./routes/pharmacy");
const staffRoutes = require("./routes/staff");
const visitsRoutes = require("./routes/visits");
const vitalsRoutes = require("./routes/vitals");

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
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/consultations`, consultationsRoutes);
app.use(`${API_PREFIX}/lab`, labRoutes);
app.use(`${API_PREFIX}/patients`, patientsRoutes);
app.use(`${API_PREFIX}/pharmacy`, pharmacyRoutes);
app.use(`${API_PREFIX}/staff`, staffRoutes);
app.use(`${API_PREFIX}/visits`, visitsRoutes);
app.use(`${API_PREFIX}/vitals`, vitalsRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
