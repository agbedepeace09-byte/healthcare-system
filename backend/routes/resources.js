const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// ==========================================
// WARDS
// ==========================================

// GET /api/v1/wards — List all wards with bed counts
router.get("/wards", async (req, res) => {
  try {
    const wards = await prisma.ward.findMany({
      include: {
        _count: { select: { beds: true, dripStands: true } },
        beds: {
          include: { patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } } },
        },
        dripStands: {
          include: { patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } } },
        },
      },
      orderBy: [{ floor: "asc" }, { name: "asc" }],
    });

    const result = wards.map((w) => ({
      ...w,
      availableBeds: w.beds.filter((b) => b.status === "AVAILABLE").length,
      occupiedBeds: w.beds.filter((b) => b.status === "OCCUPIED").length,
      maintenanceBeds: w.beds.filter((b) => b.status === "MAINTENANCE").length,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wards." });
  }
});

// POST /api/v1/wards — Create a new ward
router.post("/wards", async (req, res) => {
  try {
    const { name, code, floor, description } = req.body;

    if (!name || !code || floor === undefined) {
      return res.status(400).json({ error: "Name, code, and floor are required." });
    }

    const existing = await prisma.ward.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ error: "A ward with this code already exists." });
    }

    const ward = await prisma.ward.create({
      data: { name, code, floor: parseInt(floor), description },
    });

    res.status(201).json(ward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ward." });
  }
});

// PATCH /api/v1/wards/:id — Update ward
router.patch("/wards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, code, floor, description, status } = req.body;

    const ward = await prisma.ward.update({
      where: { id },
      data: { ...(name && { name }), ...(code && { code }), ...(floor && { floor: parseInt(floor) }), ...(description !== undefined && { description }), ...(status && { status }) },
    });

    res.status(200).json(ward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update ward." });
  }
});

// DELETE /api/v1/wards/:id — Deactivate ward
router.delete("/wards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.ward.update({ where: { id }, data: { status: "INACTIVE" } });
    res.status(200).json({ message: "Ward deactivated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to deactivate ward." });
  }
});

// ==========================================
// BEDS
// ==========================================

// GET /api/v1/beds — List all beds (optionally filtered by status/ward)
router.get("/beds", async (req, res) => {
  try {
    const { status, wardId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (wardId) where.wardId = parseInt(wardId);

    const beds = await prisma.bed.findMany({
      where,
      include: {
        ward: { select: { id: true, name: true, code: true } },
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
      },
      orderBy: [{ wardId: "asc" }, { bedNumber: "asc" }],
    });

    res.status(200).json(beds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch beds." });
  }
});

// POST /api/v1/beds — Create a bed
router.post("/beds", async (req, res) => {
  try {
    const { bedNumber, wardId } = req.body;

    if (!bedNumber || !wardId) {
      return res.status(400).json({ error: "Bed number and ward ID are required." });
    }

    const bed = await prisma.bed.create({
      data: { bedNumber, wardId: parseInt(wardId) },
    });

    res.status(201).json(bed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create bed." });
  }
});

// PATCH /api/v1/beds/:id — Update bed (assign patient, change status)
router.patch("/beds/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, patientId, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (patientId !== undefined) updateData.patientId = patientId ? parseInt(patientId) : null;
    if (notes !== undefined) updateData.notes = notes;

    if (status === "AVAILABLE") {
      updateData.patientId = null;
      updateData.allocatedAt = null;
    } else if (status === "OCCUPIED" || (patientId && status !== "MAINTENANCE")) {
      updateData.allocatedAt = new Date();
    }

    const bed = await prisma.bed.update({
      where: { id },
      data: updateData,
      include: {
        ward: { select: { id: true, name: true, code: true } },
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
      },
    });

    // Create an allocation record if a patient is assigned
    if (patientId && status === "OCCUPIED") {
      try {
        await prisma.allocation.create({
          data: {
            visitId: -1,
            patientId: parseInt(patientId),
            resourceType: "BED",
            resourceId: id,
            notes: notes || null,
          },
        });
      } catch (err) {
        console.warn("Could not create allocation record (visit context may be missing):", err.message);
      }
    }

    res.status(200).json(bed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update bed." });
  }
});

// ==========================================
// DRIP STANDS
// ==========================================

// GET /api/v1/drip-stands — List all drip stands
router.get("/drip-stands", async (req, res) => {
  try {
    const { status, wardId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (wardId) where.wardId = parseInt(wardId);

    const dripStands = await prisma.dripStand.findMany({
      where,
      include: {
        ward: { select: { id: true, name: true, code: true } },
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
      },
      orderBy: { standCode: "asc" },
    });

    res.status(200).json(dripStands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch drip stands." });
  }
});

// POST /api/v1/drip-stands — Create a drip stand
router.post("/drip-stands", async (req, res) => {
  try {
    const { standCode, wardId } = req.body;

    if (!standCode) {
      return res.status(400).json({ error: "Stand code is required." });
    }

    const existing = await prisma.dripStand.findUnique({ where: { standCode } });
    if (existing) {
      return res.status(400).json({ error: "A drip stand with this code already exists." });
    }

    const dripStand = await prisma.dripStand.create({
      data: { standCode, wardId: wardId ? parseInt(wardId) : null },
    });

    res.status(201).json(dripStand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create drip stand." });
  }
});

// PATCH /api/v1/drip-stands/:id — Update drip stand
router.patch("/drip-stands/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, patientId, wardId } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (patientId !== undefined) updateData.patientId = patientId ? parseInt(patientId) : null;
    if (wardId !== undefined) updateData.wardId = wardId ? parseInt(wardId) : null;

    if (status === "AVAILABLE") {
      updateData.patientId = null;
      updateData.allocatedAt = null;
    } else if (status === "IN_USE" || (patientId && status !== "MAINTENANCE")) {
      updateData.allocatedAt = new Date();
    }

    const dripStand = await prisma.dripStand.update({
      where: { id },
      data: updateData,
      include: {
        ward: { select: { id: true, name: true, code: true } },
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
      },
    });

    res.status(200).json(dripStand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update drip stand." });
  }
});

// ==========================================
// NURSE ASSIGNMENTS
// ==========================================

// GET /api/v1/nurse-assignments — List nurse assignments
router.get("/nurse-assignments", async (req, res) => {
  try {
    const { status, nurseId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (nurseId) where.nurseId = parseInt(nurseId);

    const assignments = await prisma.nurseAssignment.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
        nurse: { select: { id: true, firstName: true, lastName: true, staffId: true } },
        visit: { select: { id: true, visitId: true, status: true } },
        ward: { select: { id: true, name: true, code: true } },
      },
      orderBy: [{ assignedAt: "desc" }],
    });

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch nurse assignments." });
  }
});

// POST /api/v1/nurse-assignments — Assign a nurse to a patient/visit
router.post("/nurse-assignments", async (req, res) => {
  try {
    const { visitId, patientId, nurseId, wardId, notes } = req.body;

    if (!visitId || !patientId || !nurseId) {
      return res.status(400).json({ error: "Visit ID, patient ID, and nurse ID are required." });
    }

    const assignment = await prisma.nurseAssignment.create({
      data: {
        visitId: parseInt(visitId),
        patientId: parseInt(patientId),
        nurseId: parseInt(nurseId),
        wardId: wardId ? parseInt(wardId) : null,
        notes,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
        nurse: { select: { id: true, firstName: true, lastName: true, staffId: true } },
        visit: { select: { id: true, visitId: true, status: true } },
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign nurse." });
  }
});

// PATCH /api/v1/nurse-assignments/:id — End a nurse assignment
router.patch("/nurse-assignments/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (status === "ENDED") {
      updateData.endedAt = new Date();
    }

    const assignment = await prisma.nurseAssignment.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
        nurse: { select: { id: true, firstName: true, lastName: true, staffId: true } },
      },
    });

    res.status(200).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update nurse assignment." });
  }
});

// ==========================================
// ALLOCATIONS (General resource tracking)
// ==========================================

// GET /api/v1/allocations — List all resource allocations
router.get("/allocations", async (req, res) => {
  try {
    const { status, resourceType } = req.query;

    const where = {};
    if (status) where.status = status;
    if (resourceType) where.resourceType = resourceType;

    const allocations = await prisma.allocation.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
        visit: { select: { id: true, visitId: true, status: true } },
      },
      orderBy: [{ allocatedAt: "desc" }],
    });

    res.status(200).json(allocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch allocations." });
  }
});

// POST /api/v1/allocations — Create a resource allocation
router.post("/allocations", async (req, res) => {
  try {
    const { visitId, patientId, resourceType, resourceId, notes } = req.body;

    if (!visitId || !patientId || !resourceType || !resourceId) {
      return res.status(400).json({ error: "Visit ID, patient ID, resource type, and resource ID are required." });
    }

    const allocation = await prisma.allocation.create({
      data: {
        visitId: parseInt(visitId),
        patientId: parseInt(patientId),
        resourceType,
        resourceId: parseInt(resourceId),
        notes,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, matricNumber: true } },
        visit: { select: { id: true, visitId: true, status: true } },
      },
    });

    res.status(201).json(allocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create allocation." });
  }
});

// PATCH /api/v1/allocations/:id — End an allocation
router.patch("/allocations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const allocation = await prisma.allocation.update({
      where: { id },
      data: { status: "ENDED", deallocatedAt: new Date() },
    });

    res.status(200).json(allocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to end allocation." });
  }
});

// ==========================================
// DASHBOARD / SUMMARY
// ==========================================

// GET /api/v1/resources/summary — Quick stats for resource allocation dashboard
router.get("/summary", async (req, res) => {
  try {
    const [totalWards, totalBeds, availableBeds, occupiedBeds, totalDripStands, availableDripStands, activeAssignments] = await Promise.all([
      prisma.ward.count({ where: { status: "ACTIVE" } }),
      prisma.bed.count(),
      prisma.bed.count({ where: { status: "AVAILABLE" } }),
      prisma.bed.count({ where: { status: "OCCUPIED" } }),
      prisma.dripStand.count(),
      prisma.dripStand.count({ where: { status: "AVAILABLE" } }),
      prisma.nurseAssignment.count({ where: { status: "ACTIVE" } }),
    ]);

    res.status(200).json({
      totalWards,
      totalBeds,
      availableBeds,
      occupiedBeds,
      bedUtilization: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      totalDripStands,
      availableDripStands,
      activeAssignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch resource summary." });
  }
});

module.exports = router;
