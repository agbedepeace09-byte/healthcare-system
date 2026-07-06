const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// POST: Add new staff member
router.post("/", async (req, res) => {
  try {
    const { staffId, firstName, lastName, email, role } = req.body;

    const existingStaff = await prisma.staff.findFirst({
      where: { OR: [{ staffId }, { email }] },
    });

    if (existingStaff) {
      return res
        .status(400)
        .json({ error: "Staff ID or Email already exists." });
    }

    const newStaff = await prisma.staff.create({
      data: { staffId, firstName, lastName, email, role },
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create staff member." });
  }
});

// GET: Fetch staff, optionally filtered by role
router.get("/", async (req, res) => {
  try {
    const { role } = req.query; // e.g., ?role=DOCTOR

    const staffMembers = await prisma.staff.findMany({
      where: role ? { role: role.toUpperCase() } : {},
      orderBy: { lastName: "asc" },
    });

    res.status(200).json(staffMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch staff directory." });
  }
});

module.exports = router;
