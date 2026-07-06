const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST: Staff Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const staff = await prisma.staff.findUnique({ where: { email } });
    if (!staff) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 2. Verify Password (Requires schema update for passwordHash)
    const isValidPassword = await bcrypt.compare(password, staff.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: staff.id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    // Temporary bypass until JWT/bcrypt is configured
    const mockToken = "mock_jwt_token_for_development";

    res.status(200).json({
      message: "Login successful",
      token: mockToken,
      user: {
        id: staff.id,
        name: `${staff.firstName} ${staff.lastName}`,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed." });
  }
});

// GET: Verify current session (Useful for frontend page reloads)
router.get("/me", async (req, res) => {
  // In a real app, this route would be protected by a middleware that extracts the user ID from the JWT
  res.status(200).json({ message: "Attach JWT verification middleware here." });
});

module.exports = router;
