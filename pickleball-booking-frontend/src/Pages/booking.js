import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://pickleball-booking-backend.onrender.com";

function Booking() {
  const navigate = useNavigate(); // Used for redirecting
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }
    setIsLoggedIn(true);

    // Fetch courts and bookings
    axios.get(`${API_BASE}/api/courts`)
      .then((res) => setCourts(res.data))
      .catch((err) => console.error("Error fetching courts:", err));

    axios.get(`${API_BASE}/api/bookings`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedCourt || !date || !startTime || !endTime) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    const userId = localStorage.getItem("user_id"); // Get user ID from storage

    try {
      const response = await axios.post(`${API_BASE}/api/bookings`, {
        user_id: userId,
        court_id: selectedCourt,
        date,
        start_time: startTime,
        end_time: endTime,
      });

      setMessage(`✅ Booking Confirmed! ID: ${response.data.booking.id}`);
      setBookings([...bookings, response.data.booking]);
    } catch (error) {
      setMessage("❌ Error: Court may already be booked.");
    }
  };

  return (
    <div>
      <h1>Book a Pickleball Court</h1>

      {isLoggedIn ? (
        <form onSubmit={handleBooking}>
          <label>Select Court:</label>
          <select onChange={(e) => setSelectedCourt(e.target.value)}>
            <option value="">Choose a Court</option>
            {courts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name} - {court.location}
              </option>
            ))}
          </select>

          <label>Date:</label>
          <input type="date" onChange={(e) => setDate(e.target.value)} required />

          <label>Start Time:</label>
          <select onChange={(e) => setStartTime(e.target.value)} required>
            <option value="">Select Start Time</option>
            {["08:00", "09:00", "10:00", "11:00", "12:00"].map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>

          <label>End Time:</label>
          <select onChange={(e) => setEndTime(e.target.value)} required>
            <option value="">Select End Time</option>
            {["09:00", "10:00", "11:00", "12:00", "13:00"].map((time, index) => (
              <option key={index} value={time} disabled={startTime && time <= startTime}>
                {time}
              </option>
            ))}
          </select>

          <button type="submit">Book Now</button>
        </form>
      ) : (
        <p>🔒 You must be logged in to book a court.</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default Booking;
