const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// POST: Record vitals and update visit urgency
router.post("/:visitId", async (req, res) => {
  try {
    const visitId = parseInt(req.params.visitId);
    const {
      patientId,
      recordedBy,
      temperature,
      bloodPress,
      pulseRate,
      weight,
      urgency,
    } = req.body;

    // Use a transaction to ensure vitals are saved AND visit status/urgency is updated together
    const result = await prisma.$transaction(async (tx) => {
      const vitals = await tx.vitals.create({
        data: {
          visitId,
          patientId,
          recordedBy,
          temperature,
          bloodPress,
          pulseRate,
          weight,
        },
      });

      const updatedVisit = await tx.visit.update({
        where: { id: visitId },
        data: {
          status: "WAITING_CONSULTATION", // Move to doctor's queue
          urgency: urgency || "ROUTINE",
        },
      });

      return { vitals, updatedVisit };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to record vitals." });
  }
});

// GET: Fetch historical vitals for a specific patient
router.get("/history/:patientId", async (req, res) => {
  try {
    const history = await prisma.vitals.findMany({
      where: { patientId: parseInt(req.params.patientId) },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vitals history." });
  }
});

module.exports = router;
