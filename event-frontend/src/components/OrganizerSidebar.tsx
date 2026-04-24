import { useLocation, useNavigate } from "react-router-dom";

export default function OrganizerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isMyEventsActive =
    path === "/organizer/myEvents" || path.startsWith("/organizer/event/") || path.endsWith("/attendees");

  return (
    <aside className="organizer-sidebar">
      <h2>Organizer Menu</h2>
      <button className={path === "/organizer/home" ? "active-side-btn" : ""} onClick={() => navigate("/organizer/home")}>Dashboard</button>
      <button className={isMyEventsActive ? "active-side-btn" : ""} onClick={() => navigate("/organizer/myEvents")}>My Events</button>
      <button className={path === "/organizer/create" ? "active-side-btn" : ""} onClick={() => navigate("/organizer/create")}>Create Event</button>
      <button className={path === "/profile" ? "active-side-btn" : ""} onClick={() => navigate("/profile")}>Profile</button>
    </aside>
  );
}
