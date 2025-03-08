const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// 🔹 Get All Bookings (Admin Only)
router.get("/admin", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bookings.id, users.name AS user_name, courts.name AS court_name, 
             bookings.date, bookings.start_time, bookings.end_time
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN courts ON bookings.court_id = courts.id
      ORDER BY bookings.date, bookings.start_time;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Delete a Booking (Admin Only)
router.delete("/admin/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
    res.json({ message: `✅ Booking ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
