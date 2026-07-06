const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// POST: Register a new patient (Student)
router.post("/", async (req, res) => {
  try {
    const {
      matricNumber,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      department,
      level,
    } = req.body;

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { matricNumber },
    });
    if (existingPatient) {
      return res
        .status(400)
        .json({ error: "Patient with this Matric Number already exists." });
    }

    const newPatient = await prisma.patient.create({
      data: {
        matricNumber,
        firstName,
        lastName,
        gender,
        contactNumber,
        department,
        level,
        dateOfBirth: new Date(dateOfBirth),
      },
    });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register patient." });
  }
});

// GET: Search patient by Matric Number
router.get("/search/:matricNumber", async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { matricNumber: req.params.matricNumber },
      include: {
        visits: {
          orderBy: { checkInTime: "desc" },
          take: 5, // Get last 5 visits for quick context
        },
      },
    });

    if (!patient) return res.status(404).json({ error: "Patient not found." });
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch patient." });
  }
});

// GET: All patients (with optional pagination for the frontend table)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const patients = await prisma.patient.findMany({
      skip,
      take: limit,
      orderBy: { lastName: "asc" },
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});

module.exports = router;
