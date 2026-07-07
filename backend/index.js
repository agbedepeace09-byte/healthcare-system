const path = require("path");
try {
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
} catch (e) {
  console.warn("dotenv failed to load:", e.message);
}
const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

// Import the modular routers
const authRoutes = require("./routes/auth");
const consultationsRoutes = require("./routes/consultations");
const labRoutes = require("./routes/lab");
const patientsRoutes = require("./routes/patients");
const pharmacyRoutes = require("./routes/pharmacy");
const staffRoutes = require("./routes/staff");
const visitsRoutes = require("./routes/visits");
const vitalsRoutes = require("./routes/vitals");
const resourcesRoutes = require("./routes/resources");

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
app.use(`${API_PREFIX}`, resourcesRoutes);

// 404 handler for unmatched API routes under the API prefix
app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.startsWith(API_PREFIX)) {
    return res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
  }
  return next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
