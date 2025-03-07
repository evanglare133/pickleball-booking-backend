const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const pool = require("./config/db"); // Import PostgreSQL connection

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Pickleball Booking API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const authRoutes = require("./routes/authRoutes"); // Import Authentication Routes
app.use("/api/auth", authRoutes); // Use them
