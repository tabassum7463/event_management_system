import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/user/EventList.css";
import { EVENT_CATEGORIES } from "../../constants/eventCategories";
import UserSidebar from "../../components/UserSidebar";

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

type EventStatusFilter = "" | "UPCOMING" | "ONGOING" | "COMPLETED";

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "-";
  const t = new Date(`1970-01-01T${timeStr}`);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getEventStatus = (eventDate: string, startTime?: string, endTime?: string) => {
  if (!eventDate || !startTime || !endTime) return "UPCOMING";

  const now = new Date();
  const start = new Date(`${eventDate}T${startTime}`);
  const end = new Date(`${eventDate}T${endTime}`);

  if (now < start) return "UPCOMING";
  if (now > end) return "COMPLETED";
  return "ONGOING";
};

const filterByStatus = (events: Event[], statusFilter: EventStatusFilter) => {
  if (!statusFilter) return events;
  return events.filter((event) => getEventStatus(event.eventDate, event.startTime, event.endTime) === statusFilter);
};

export default function EventList() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("");

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/api/events");
      setEvents(filterByStatus(res.data, statusFilter));
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

      setEvents(filterByStatus(res.data, statusFilter));
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
    setStatusFilter("");
    fetchAllEvents();
  };

  return (
    <div className="events-layout">
      <UserSidebar />

      <div className="events-container">
        <h2>All Events</h2>

        <div className="search-container">
          <input type="text" placeholder="Search by city" value={city} onChange={(e) => setCity(e.target.value)} />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as EventStatusFilter)}>
            <option value="">All Status</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        <div className="events-grid">
          {events.map((event) => {
            const status = getEventStatus(event.eventDate, event.startTime, event.endTime);

            return (
              <div key={event.id} className="event-card">
                <div className="status-wrapper">
                  <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                </div>

                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <p>
                  <strong>City:</strong> {event.city}
                </p>
                <p>
                  <strong>Category:</strong> {event.category}
                </p>

                <p>
                  <strong>Date:</strong> {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "-"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {event.startTime && event.endTime ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}` : "-"}
                </p>

                <p>
                  <strong>Price:</strong> Rs {event.price}
                </p>

                <button disabled={status !== "UPCOMING"} onClick={() => navigate(`/events/${event.id}`)}>
                  {status === "COMPLETED" ? "Event Completed" : status === "ONGOING" ? "Event Started" : "Book Ticket"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
