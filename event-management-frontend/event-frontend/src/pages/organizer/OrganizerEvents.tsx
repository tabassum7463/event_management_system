// File: src/pages/organizer/OrganizerDashboard.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/organizer/OrganizerEvents.css";

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  city: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}


const getEventStatus = (
  eventDate: string,
  startTime: string,
  endTime: string
) => {
  const now = new Date();
  const start = new Date(`${eventDate}T${startTime}`);
  const end = new Date(`${eventDate}T${endTime}`);

  if (now < start) return "UPCOMING";
  if (now > end) return "COMPLETED";
  return "ONGOING";
};

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const organizerId = user?.id;

  // ✅ Fetch organizer events
  const fetchEvents = async () => {
    if (!organizerId) return;

    try {
      const res = await api.get(`/api/events/organizer/${organizerId}`);
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [organizerId]);


  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/events/organizer/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="organizer-dashboard-container">
    
      <aside className="organizer-sidebar">
        <h2>Organizer Menu</h2>

        <button onClick={() => navigate("/profile")}>
          👤 Profile
        </button>

        <button onClick={() => navigate("/organizer/myEvents")}>
          📋 My Events
        </button>

        <button onClick={() => navigate("/organizer/create")}>
          ➕ Create Event
        </button>
      </aside>

      
      <main className="organizer-main">
        <h1>Welcome, {user?.username || user?.email} </h1>
        <p>Manage your events below</p>

        {events.length === 0 ? (
          <p className="no-events">You haven’t created any events yet.</p>
        ) : (
          <div className="organizer-event-cards">
            {events.map((event) => {
              const status = getEventStatus(
                event.eventDate,
                event.startTime,
                event.endTime
              );

              return (
                <div key={event.id} className="organizer-event-card">

                  
                  <span className={`organizer-status-badge ${status.toLowerCase()}`}>
                    {status}
                  </span>

                  <h3>{event.title}</h3>

                  <p>
                    📅 {new Date(event.eventDate).toLocaleDateString()} at{" "}
                    {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>

                  <p>📍 {event.city}</p>
                  <p>💰 ₹{event.price}</p>

                  <div className="organizer-card-actions">
                    <button
                      onClick={() =>
                        navigate(`/organizer/event/${event.id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/organizer/${event.id}/attendees`)
                      }
                    >
                      Attendees
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}