const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

// POST: Add new staff member
router.post("/", async (req, res) => {
  try {
    const { staffId, firstName, lastName, email, role, password } = req.body;

    const existingStaff = await prisma.staff.findFirst({
      where: { OR: [{ staffId }, { email }] },
    });

    if (existingStaff) {
      return res
        .status(400)
        .json({ error: "Staff ID or Email already exists." });
    }

    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash(`${firstName.toLowerCase()}.${lastName.toLowerCase()}`, 10);

    const newStaff = await prisma.staff.create({
      data: { staffId, firstName, lastName, email, role, passwordHash },
      select: { id: true, staffId: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({ ...newStaff, passwordGenerated: !password });
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
