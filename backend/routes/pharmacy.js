const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// GET: Fetch active queue for the Pharmacy
router.get("/queue", async (req, res) => {
  try {
    const pendingPrescriptions = await prisma.visit.findMany({
      where: {
        status: "AT_PHARMACY",
        prescriptions: { some: { status: "PENDING" } },
      },
      include: {
        patient: {
          select: { firstName: true, lastName: true, matricNumber: true },
        },
        prescriptions: { where: { status: "PENDING" } },
      },
      orderBy: { checkInTime: "asc" },
    });
    res.status(200).json(pendingPrescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pharmacy queue." });
  }
});

// PATCH: Dispense medication and discharge the patient
router.patch("/:prescriptionId/dispense", async (req, res) => {
  try {
    const prescriptionId = parseInt(req.params.prescriptionId);
    const { pharmacistId, visitId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const dispensed = await tx.prescription.update({
        where: { id: prescriptionId },
        data: {
          pharmacistId,
          status: "COMPLETED",
        },
      });

      // Check if this was the last pending prescription for the visit
      const remaining = await tx.prescription.count({
        where: { visitId, status: "PENDING" },
      });

      let updatedVisit = null;
      if (remaining === 0) {
        // All drugs dispensed, discharge the patient
        updatedVisit = await tx.visit.update({
          where: { id: visitId },
          data: {
            status: "DISCHARGED",
            dischargeTime: new Date(),
          },
        });
      }

      return { dispensed, updatedVisit };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to dispense medication." });
  }
});

module.exports = router;
