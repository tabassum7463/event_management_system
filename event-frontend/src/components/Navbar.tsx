import { NavLink, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import NotificationBell from "./NotificationBell";

type NavbarProps = {
  userRole: "USER" | "ORGANIZER" | "ADMIN";
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function Navbar({ userRole, theme, onToggleTheme }: NavbarProps) {
  const navigate = useNavigate();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? " active-nav-link" : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>EventSphere</h3>
        <p>Event Management Platform</p>
      </div>

      <div className="navbar-right">
        {userRole === "USER" && (
          <>
            <NavLink className={navLinkClass} to="/user/home">
              Dashboard
            </NavLink>
            <NavLink className={navLinkClass} to="/events">
              Events
            </NavLink>
            <NavLink className={navLinkClass} to="/my-bookings">
              My Bookings
            </NavLink>
            <NavLink className={navLinkClass} to="/profile">
              Profile
            </NavLink>
          </>
        )}

        {userRole === "ORGANIZER" && (
          <>
            <NavLink className={navLinkClass} to="/organizer/home">
              Dashboard
            </NavLink>
            <NavLink className={navLinkClass} to="/organizer/myEvents">
              My Events
            </NavLink>
            <NavLink className={navLinkClass} to="/organizer/create">
              Create Event
            </NavLink>
            <NavLink className={navLinkClass} to="/profile">
              Profile
            </NavLink>
          </>
        )}

        {userRole === "ADMIN" && (
          <>
            <NavLink className={navLinkClass} to="/admin/home">
              Dashboard
            </NavLink>
            <NavLink className={navLinkClass} to="/admin/users">
              Users
            </NavLink>
            <NavLink className={navLinkClass} to="/profile">
              Profile
            </NavLink>
          </>
        )}

        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          {theme === "light" ? "Dark" : "Light"} Mode
        </button>

        <NotificationBell />

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
