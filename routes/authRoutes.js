const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// 🔹 Register User (Default is regular user)
router.post("/register", async (req, res) => {
  const { name, email, password, is_admin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, is_admin || false] // Default is_admin = false
    );
    res.json({ message: "✅ User registered successfully", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Login User (Check if Admin)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "❌ Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "❌ Invalid credentials" });

    const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "✅ Login successful", token, user_id: user.id, is_admin: user.is_admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
