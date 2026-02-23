

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/organizer/OrganizerDashboard.css";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const organizerId = user?.id;

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    if (!organizerId) return;

    try {
      const res = await api.get(`/api/events/organizer/${organizerId}`);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = res.data
        .filter((event: Event) => {
          const eventDate = new Date(event.eventDate);
          return eventDate >= today;
        })
        .sort(
          (a: Event, b: Event) =>
            new Date(a.eventDate).getTime() -
            new Date(b.eventDate).getTime()
        );

      setUpcomingEvents(filtered);
    } catch (err) {
      console.error("Failed to fetch organizer events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [organizerId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/api/events/organizer/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
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

      <main className="dashboard-main">

     
        <section className="dashboard-hero">
          <h1>Welcome back, {user?.username || user?.email} </h1>
          <p>Manage your upcoming events efficiently.</p>
          <button
            className="hero-btn"
            onClick={() => navigate("/organizer/create")}
          >
            Create New Event
          </button>
        </section>

      
        <section className="my-events">
          <h2>Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p className="no-events">No upcoming events available.</p>
          ) : (
            <div className="event-cards">
              {upcomingEvents.map((event) => {
                

                return (
                  <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>

          <p>
 <p>
    <strong>Date:</strong>{" "}
    {new Date(event.eventDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}
  </p>
            
  <strong>Time:</strong>{" "}
  {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}{" "}
  -
  {" "}
  {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</p>

                    <p>📍 {event.city}</p>

                    <p>💰 ₹{event.price}</p>

                    <p>
                      🎟 Total Seats: {event.totalSeats}
                    </p>

                   

                    <div className="card-actions">


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
        </section>
      </main>
    </div>
  );
}