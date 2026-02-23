import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  userRole: "USER" | "ORGANIZER";
}

export default function Navbar({ userRole }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>Event Management</h3>
      </div>

      <div className="navbar-right">
        {userRole === "USER" && (
          <>
            <Link to="/user/home">Dashboard</Link>
            <Link to="/events">Events</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {userRole === "ORGANIZER" && (
          <>
            <Link to="/organizer/home">Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {/* 🔔 Notification */}
        <NotificationBell />

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}