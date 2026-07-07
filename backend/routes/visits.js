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

// GET: Fetch a specific visit by visitId
router.get("/:visitId", async (req, res) => {
  try {
    const { visitId } = req.params;

    // First try to find by string visitId (VST-XXX format)
    let visit = await prisma.visit.findUnique({
      where: { visitId },
      include: {
        patient: true,
        vitals: true,
        notes: true,
        labRequests: true,
        prescriptions: true,
        doctor: { select: { firstName: true, lastName: true } },
      },
    });

    // If not found by visitId string, try by numeric id
    if (!visit) {
      const numericId = parseInt(visitId);
      if (!isNaN(numericId)) {
        visit = await prisma.visit.findUnique({
          where: { id: numericId },
          include: {
            patient: true,
            vitals: true,
            notes: true,
            labRequests: true,
            prescriptions: true,
            doctor: { select: { firstName: true, lastName: true } },
          },
        });
      }
    }

    if (!visit) {
      return res.status(404).json({ error: "Visit not found." });
    }

    res.status(200).json(visit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch visit." });
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

// POST: Admit a patient and allocate resources (bed, drip stand, nurse assignment)
router.post("/:id/admit", async (req, res) => {
  try {
    const visitId = parseInt(req.params.id);
    const { bedId, wardId, dripStandId, nurseId, status } = req.body;

    const visit = await prisma.visit.findUnique({ where: { id: visitId } });
    if (!visit) return res.status(404).json({ error: "Visit not found." });

    const patientId = visit.patientId;

    // Use a transaction to ensure atomicity
    const results = await prisma.$transaction(async (tx) => {
      const createdAllocations = [];

      // Allocate bed: either use provided bedId or find first available in ward
      let bed = null;
      if (bedId) {
        bed = await tx.bed.findUnique({ where: { id: parseInt(bedId) } });
        if (!bed) throw new Error("Specified bed not found");
        if (bed.status !== "AVAILABLE") throw new Error("Specified bed is not available");
        await tx.bed.update({ where: { id: bed.id }, data: { status: "OCCUPIED", patientId, allocatedAt: new Date() } });
        const alloc = await tx.allocation.create({ data: { visitId, patientId, resourceType: "BED", resourceId: bed.id } });
        createdAllocations.push(alloc);
      } else if (wardId) {
        const availableBed = await tx.bed.findFirst({ where: { wardId: parseInt(wardId), status: "AVAILABLE" }, orderBy: { id: "asc" } });
        if (!availableBed) throw new Error("No available beds in the specified ward");
        await tx.bed.update({ where: { id: availableBed.id }, data: { status: "OCCUPIED", patientId, allocatedAt: new Date() } });
        const alloc = await tx.allocation.create({ data: { visitId, patientId, resourceType: "BED", resourceId: availableBed.id } });
        createdAllocations.push(alloc);
        bed = availableBed;
      }

      // Allocate drip stand if requested: use provided or find in ward
      let drip = null;
      if (dripStandId) {
        drip = await tx.dripStand.findUnique({ where: { id: parseInt(dripStandId) } });
        if (!drip) throw new Error("Specified drip stand not found");
        if (drip.status !== "AVAILABLE") throw new Error("Specified drip stand is not available");
        await tx.dripStand.update({ where: { id: drip.id }, data: { status: "IN_USE", patientId, allocatedAt: new Date() } });
        const alloc = await tx.allocation.create({ data: { visitId, patientId, resourceType: "DRIP_STAND", resourceId: drip.id } });
        createdAllocations.push(alloc);
      } else if (wardId) {
        const availableDrip = await tx.dripStand.findFirst({ where: { wardId: parseInt(wardId), status: "AVAILABLE" }, orderBy: { id: "asc" } });
        if (availableDrip) {
          await tx.dripStand.update({ where: { id: availableDrip.id }, data: { status: "IN_USE", patientId, allocatedAt: new Date() } });
          const alloc = await tx.allocation.create({ data: { visitId, patientId, resourceType: "DRIP_STAND", resourceId: availableDrip.id } });
          createdAllocations.push(alloc);
          drip = availableDrip;
        }
      }

      // Create nurse assignment if nurseId provided
      let nurseAssignment = null;
      if (nurseId) {
        nurseAssignment = await tx.nurseAssignment.create({
          data: {
            visitId,
            patientId,
            nurseId: parseInt(nurseId),
            wardId: wardId ? parseInt(wardId) : null,
          },
        });
      }

      // Optionally update visit status
      if (status) {
        await tx.visit.update({ where: { id: visitId }, data: { status } });
      }

      return { bed, drip, nurseAssignment, createdAllocations };
    });

    res.status(200).json({ message: "Patient admitted and resources allocated.", details: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to admit patient and allocate resources." });
  }
});

module.exports = router;
