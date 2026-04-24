import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/user/UserDashboard.css";
import heroIllustration from "../../assets/image.png";
import UserSidebar from "../../components/UserSidebar";

interface Event {
  id: number;
  title: string;
  eventDate: string;
  startTime: string;
  endTime?: string;
  city: string;
}

const getEventStatus = (eventDate: string, startTime?: string, endTime?: string) => {
  if (!eventDate || !startTime || !endTime) return "UPCOMING";

  const now = new Date();
  const start = new Date(`${eventDate}T${startTime}`);
  const end = new Date(`${eventDate}T${endTime}`);

  if (now < start) return "UPCOMING";
  if (now > end) return "COMPLETED";
  return "ONGOING";
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingRes, allRes] = await Promise.all([api.get("/api/events/upcoming"), api.get("/api/events")]);
        setUpcomingEvents(upcomingRes.data);

        const ongoing = (allRes.data as Event[]).filter(
          (event) => getEventStatus(event.eventDate, event.startTime, event.endTime) === "ONGOING"
        );

        setLiveEvents(ongoing);
      } catch (err) {
        console.error("Failed to fetch dashboard events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="user-dashboard-container">
      <UserSidebar />

      <main className="dashboard-main">
        <section className="hero hero-image-banner">
          <img src={heroIllustration} alt="Featured events" className="hero-image" />
          <div className="hero-overlay">
            <h2>Welcome, {user?.username || user?.email}</h2>
            <p>Discover, book, and manage your event plans in one place.</p>
            <button onClick={() => navigate("/events")}>Browse Events</button>
          </div>
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
                    {new Date(event.eventDate).toLocaleDateString()} at {event.startTime}
                  </p>
                  <p>{event.city}</p>
                  <button onClick={() => navigate(`/events/${event.id}`)}>View Details</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="live-events">
          <h2>Live Events</h2>

          {liveEvents.length === 0 ? (
            <p>No live events right now.</p>
          ) : (
            <div className="upcoming-event-cards">
              {liveEvents.map((event) => (
                <div key={event.id} className="upcoming-event-card">
                  <span className="live-pill">LIVE</span>
                  <h3>{event.title}</h3>
                  <p>
                    {new Date(event.eventDate).toLocaleDateString()} at {event.startTime}
                  </p>
                  <p>{event.city}</p>
                  <button onClick={() => navigate(`/events/${event.id}`)}>Join Now</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
