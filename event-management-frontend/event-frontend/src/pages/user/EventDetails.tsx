import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/user/EventDetails.css";
import PaymentModal from "../../components/PaymentModal";

interface Event {

  id: number;
  title: string;
  description: string;
  city: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;

}

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/api/events/${id}`)
        .then((res) => setEvent(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleBooking = async () => {
    if (!event) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      setMessage("❌ You must be logged in to book tickets");
      setShowPayment(false);
      return;
    }

  
    if (event.availableSeats <= 0) {
      setMessage("❌ No seats available for this event.");
      setShowPayment(false);
      return;
    }

    if (tickets > event.availableSeats) {
      setMessage(`❌ Only ${event.availableSeats} seat(s) available.`);
      setShowPayment(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/bookings/create", {
        eventId: event.id,
        userId: user.id,
        quantity: tickets,
      });

      setShowPayment(false);
      navigate("/my-bookings");

    } catch (err: any) {
      console.error(err);

      const errorMessage =
        err.response?.data?.message || "❌ Booking failed";

      setMessage(errorMessage);
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <p>Loading event details...</p>;

  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="event-details-container">
      <h2 className="event-title">{event.title}</h2>
      <p className="event-subtitle">{event.description}</p>

      <p><strong>City:</strong> {event.city}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Date:</strong> {formatDate(event.eventDate)}</p>
      <p>
        <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
      </p>

      <p><strong>Price:</strong> ₹{event.price}</p>

      <p>
        <strong>Available Seats:</strong>{" "}
        <span style={{ color: isSoldOut ? "red" : "black", fontWeight: "bold" }}>
          {isSoldOut ? "Sold Out" : event.availableSeats}
        </span>
      </p>

      {!isSoldOut && (
        <div className="ticket-row">
          <span className="ticket-label">Tickets</span>
          <div className="ticket-counter">
            <button
              type="button"
              onClick={() => setTickets(prev => (prev > 1 ? prev - 1 : 1))}
              className="counter-btn"
            >
              −
            </button>

            <span className="ticket-count">{tickets}</span>

            <button
              type="button"
              onClick={() =>
                setTickets(prev =>
                  prev < event.availableSeats ? prev + 1 : prev
                )
              }
              className="counter-btn"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        className="book-ticket-btn"
        onClick={() => setShowPayment(true)}
        disabled={loading || isSoldOut}
      >
        {isSoldOut
          ? "Sold Out"
          : loading
          ? "Processing..."
          : "Book Ticket"}
      </button>

      {message && <p className="booking-message">{message}</p>}

      {showPayment && !isSoldOut && (
        <PaymentModal
          amount={event.price * tickets}
          onClose={handleBooking}
        />
      )}
    </div>
  );
}