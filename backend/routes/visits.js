const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// POST: Check-in a patient (Creates a new Visit)
router.post("/check-in", async (req, res) => {
  try {
    const { patientId } = req.body;

    // Ensure the patient doesn't already have an active visit
    const activeVisit = await prisma.visit.findFirst({
      where: {
        patientId,
        status: { notIn: ["DISCHARGED", "CANCELLED"] },
      },
    });

    if (activeVisit) {
      return res
        .status(400)
        .json({
          error: "Patient already has an active visit in the queue.",
          activeVisit,
        });
    }

    const newVisit = await prisma.visit.create({
      data: {
        visitId: `VST-${Date.now()}`,
        patientId,
        status: "WAITING_TRIAGE", // Enters the Nurse's queue
      },
      include: { patient: true },
    });

    res.status(201).json(newVisit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to check-in patient." });
  }
});

// GET: Fetch active queues by status (Used by Nurse & Doctor Dashboards)
router.get("/queue", async (req, res) => {
  try {
    const { status } = req.query; // e.g., ?status=WAITING_TRIAGE

    const queue = await prisma.visit.findMany({
      where: status
        ? { status }
        : { status: { notIn: ["DISCHARGED", "CANCELLED"] } },
      include: {
        patient: {
          select: { firstName: true, lastName: true, matricNumber: true },
        },
        vitals: true,
      },
      orderBy: [
        { urgency: "desc" }, // URGENT/EMERGENCY bubbles to the top
        { checkInTime: "asc" }, // Then sorts by longest waiting
      ],
    });

    res.status(200).json(queue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch queue." });
  }
});

// PATCH: Update visit status (e.g., Doctor accepts patient, moves to Lab, etc.)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, doctorId } = req.body;
    const visitId = parseInt(req.params.id);

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status,
        ...(doctorId && { doctorId }), // Assign doctor if provided
        ...(status === "DISCHARGED" && { dischargeTime: new Date() }),
      },
    });

    res.status(200).json(updatedVisit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update visit status." });
  }
});

module.exports = router;
