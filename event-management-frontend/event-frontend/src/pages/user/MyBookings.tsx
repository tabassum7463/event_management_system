import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/pages/user/MyBookings.css";

interface Event {
  id: number;
  title: string;
  city: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
}

interface Booking {
  id: number;
  quantity: number;
  totalPrice: number;
  status: string;
  bookedAt: string;
  event: Event;
}


const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();


const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString();


const formatTime = (timeStr?: string) => {
  if (!timeStr) return "-";
  const t = new Date(`1970-01-01T${timeStr}`);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    api
      .get(`/api/bookings/user/${user.id}`)
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id: number) => {
    try {
      await api.post(`/api/bookings/cancel/${id}`);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch {
      alert("Failed to cancel booking");
    }
  };

  if (loading) return <p className="center-text">Loading bookings...</p>;
  if (error) return <p className="center-text error-text">{error}</p>;
  if (bookings.length === 0) return <p className="center-text">No bookings found.</p>;

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>

      {bookings.map((b) => {
        const start = b.event.startTime;
        const end = b.event.endTime;

        return (
          <div key={b.id} className="booking-card">
            <div className="booking-header">
              <h3>{b.event.title}</h3>
              <span className={`status ${b.status.toLowerCase()}`}>
                {b.status}
              </span>
            </div>

            <p><strong>City:</strong> {b.event.city}</p>

            <p>
              <strong>Date:</strong> {formatDate(b.event.eventDate)}
            </p>

            <p>
              <strong>Time:</strong> {start && end ? `${formatTime(start)} - ${formatTime(end)}` : "-"}
            </p>

            <p><strong>Tickets:</strong> {b.quantity}</p>
            <p><strong>Total Paid:</strong> ₹{b.totalPrice}</p>

            <p><strong>Booked On:</strong> {formatDateTime(b.bookedAt)}</p>

            {b.status === "CONFIRMED" && (
              <button className="cancel-btn" onClick={() => cancelBooking(b.id)}>
                Cancel Booking
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}