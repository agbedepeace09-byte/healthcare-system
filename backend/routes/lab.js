const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// GET: Fetch the active queue for the Laboratory
router.get("/queue", async (req, res) => {
  try {
    const pendingLabs = await prisma.visit.findMany({
      where: { status: "AT_LAB" },
      include: {
        patient: {
          select: { firstName: true, lastName: true, matricNumber: true },
        },
        labRequests: { where: { status: "PENDING" } },
      },
      orderBy: { checkInTime: "asc" },
    });
    res.status(200).json(pendingLabs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch laboratory queue." });
  }
});

// PATCH: Complete a lab test and route patient back to the doctor
router.patch("/:requestId/complete", async (req, res) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { labTechId, results, resultFileUrl, visitId } = req.body;

    // Transaction ensures the request is marked complete AND the visit state moves forward
    const result = await prisma.$transaction(async (tx) => {
      const updatedLab = await tx.labRequest.update({
        where: { id: requestId },
        data: {
          labTechId,
          results,
          resultFileUrl,
          status: "COMPLETED",
        },
      });

      const updatedVisit = await tx.visit.update({
        where: { id: visitId },
        data: { status: "WAITING_LAB_REVIEW" }, // Pops back onto the Doctor's dashboard
      });

      return { updatedLab, updatedVisit };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete lab request." });
  }
});

module.exports = router;
