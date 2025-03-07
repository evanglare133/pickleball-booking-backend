import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://pickleball-booking-backend.onrender.com";

function Booking() {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/courts`)
      .then((res) => setCourts(res.data))
      .catch((err) => console.error("Error fetching courts:", err));
  }, []);

  return (
    <div>
      <h1>Book a Pickleball Court</h1>
      <ul>
        {courts.map((court) => (
          <li key={court.id}>
            {court.name} - {court.location} 
            {court.available ? " ✅ Available" : " ❌ Booked"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Booking;
