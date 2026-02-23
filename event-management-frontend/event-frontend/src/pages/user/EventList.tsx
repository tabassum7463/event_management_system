import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/user/EventList.css";

interface Event {
  id: number;
  title: string;
  description: string;
  city: string;
  category: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  price: number;
  availableSeats: number;
}

// ✅ Format time like 06:00 PM
const formatTime = (timeStr?: string) => {
  if (!timeStr) return "-";
  const t = new Date(`1970-01-01T${timeStr}`);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ✅ NEW: Get Event Status (Frontend Logic Only)
const getEventStatus = (
  eventDate: string,
  startTime?: string,
  endTime?: string
) => {
  if (!eventDate || !startTime || !endTime) return "UPCOMING";

  const now = new Date();
  const start = new Date(`${eventDate}T${startTime}`);
  const end = new Date(`${eventDate}T${endTime}`);

  if (now < start) return "UPCOMING";
  if (now > end) return "COMPLETED";
  return "ONGOING";
};

export default function EventList() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/api/events");
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.get("/api/events/search", {
        params: {
          city: city || undefined,
          category: category || undefined,
        },
      });

      setEvents(res.data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
        setEvents([]);
      } else {
        console.error("Search failed:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleReset = () => {
    setCity("");
    setCategory("");
    fetchAllEvents();
  };

  return (
    <div className="events-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Menu</h2>
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
        <button onClick={() => navigate("/events")}>🎫 Browse Events</button>
        <button onClick={() => navigate("/my-bookings")}>📄 My Bookings</button>
      </aside>

      {/* Main Content */}
      <div className="events-container">
        <h2>All Events</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        <div className="events-grid">
          {events.map((event) => {
            const status = getEventStatus(
              event.eventDate,
              event.startTime,
              event.endTime
            );

            return (
              <div key={event.id} className="event-card">
  <div className="status-wrapper">
    <span className={`status-badge ${status.toLowerCase()}`}>
      {status}
    </span>
  </div>

  <h3>{event.title}</h3>

                <p>{event.description}</p>

                <p><strong>City:</strong> {event.city}</p>
                <p><strong>Category:</strong> {event.category}</p>

                <p>
                  <strong>Date:</strong>{" "}
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {event.startTime && event.endTime
                    ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                    : "-"}
                </p>

                <p><strong>Price:</strong> ₹{event.price}</p>

                {/* ✅ UPDATED BUTTON */}
                <button
                  disabled={status !== "UPCOMING"}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {status === "COMPLETED"
                    ? "Event Completed"
                    : status === "ONGOING"
                    ? "Event Started"
                    : "Book Ticket"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}