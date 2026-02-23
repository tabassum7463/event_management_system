import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/user/UserDashboard.css";


interface Event {
  id: number;
  title: string;
  eventDate: string;
  startTime: string;
  city: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch upcoming events (next 3 days)
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await api.get("/api/events/upcoming");
        setUpcomingEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="user-dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Menu</h2>
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
        <button onClick={() => navigate("/events")}>🎫 Browse Events</button>
        <button onClick={() => navigate("/my-bookings")}>📄 My Bookings</button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome / Topbar */}
        <div className="dashboard-topbar">
          <h1>Welcome, {user?.username || user?.email} </h1>
          <p>Discover and book upcoming events near you</p>
        </div>

   
        <section className="hero">
          <h2>Find & Book Events Easily</h2>
          <p>Browse events, track bookings, and never miss a fun event.</p>
          <button onClick={() => navigate("/events")}>Browse Events</button>
        </section>

       
        <section className="upcoming-events">
          <h2>Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p>No upcoming events in the next 3 days.</p>
          ) : (
            <div className="upcoming-event-cards">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="upcoming-event-card">
                  <h3>{event.title}</h3>
                  <p>
                    📅 {new Date(event.eventDate).toLocaleDateString()} at{" "}
                    {event.startTime}
                  </p>
                  <p>📍 {event.city}</p>
                  <button onClick={() => navigate(`/events/${event.id}`)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}