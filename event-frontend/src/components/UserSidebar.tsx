import { useLocation, useNavigate } from "react-router-dom";

export default function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/events") return location.pathname.startsWith("/events");
    return location.pathname === path;
  };

  const cls = (path: string) => (isActive(path) ? "active-side-btn" : "");

  return (
    <aside className="sidebar">
      <h2>Menu</h2>
      <button className={cls("/user/home")} onClick={() => navigate("/user/home")}>Dashboard</button>
      <button className={cls("/events")} onClick={() => navigate("/events")}>Browse Events</button>
      <button className={cls("/my-bookings")} onClick={() => navigate("/my-bookings")}>My Bookings</button>
      <button className={cls("/profile")} onClick={() => navigate("/profile")}>Profile</button>
    </aside>
  );
}
