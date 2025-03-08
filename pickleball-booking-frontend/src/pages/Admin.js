import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://pickleball-booking-backend.onrender.com";

function Admin() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch all bookings (admin only)
    axios.get(`${API_BASE}/api/bookings/admin`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching admin bookings:", err));
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/bookings/admin/${id}`);
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div>
      <h1>Admin Panel - Manage Bookings</h1>

      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Court</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.user_name}</td>
              <td>{booking.court_name}</td>
              <td>{booking.date}</td>
              <td>{booking.start_time} - {booking.end_time}</td>
              <td>
                <button onClick={() => handleDelete(booking.id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
