import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import UserDashboard from "./pages/user/UserDashboard";
import EventList from "./pages/user/EventList";
import EventDetails from "./pages/user/EventDetails";
import MyBookings from "./pages/user/MyBookings";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import OrganizerEventDetails from "./pages/organizer/OrganizerEventDetails";
import Attendees from "./pages/organizer/Attendees";

import AdminDashboard from "./pages/admin/AdminUser";
import AdminUsers from "./pages/admin/AdminUser";

import Profile from "./pages/common/Profile";

type Role = "USER" | "ORGANIZER" | "ADMIN" | null;

type LoggedUser = {
  id: number;
  email: string;
  role: Role;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const user: LoggedUser = JSON.parse(storedUser);
        if (user.role) {
          setIsLoggedIn(true);
          setRole(user.role);
        }
      } catch {
        console.error("Invalid user data in localStorage");
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {isLoggedIn && role && (
        <Navbar
          userRole={role}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
        />
      )}

      <div className="app-shell">
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                role === "ORGANIZER" ? (
                  <Navigate to="/organizer/home" />
                ) : role === "ADMIN" ? (
                  <Navigate to="/admin/home" />
                ) : (
                  <Navigate to="/user/home" />
                )
              ) : (
                <Login
                  onLogin={(user: LoggedUser) => {
                    setIsLoggedIn(true);
                    setRole(user.role);
                    localStorage.setItem("user", JSON.stringify(user));
                  }}
                />
              )
            }
          />

          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <Signup />}
          />

          <Route
            path="/user/home"
            element={
              isLoggedIn && role === "USER" ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/events"
            element={
              isLoggedIn && role === "USER" ? (
                <EventList />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/events/:id" element={isLoggedIn ? <EventDetails /> : <Navigate to="/login" />} />

          <Route
            path="/my-bookings"
            element={
              isLoggedIn && role === "USER" ? (
                <MyBookings />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/organizer/home"
            element={
              isLoggedIn && role === "ORGANIZER" ? (
                <OrganizerDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/organizer/create"
            element={
              isLoggedIn && role === "ORGANIZER" ? (
                <CreateEvent />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/organizer/myEvents"
            element={
              isLoggedIn && role === "ORGANIZER" ? (
                <OrganizerEvents />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/organizer/event/:id"
            element={
              isLoggedIn && role === "ORGANIZER" ? (
                <OrganizerEventDetails />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/organizer/:eventId/attendees"
            element={
              isLoggedIn && role === "ORGANIZER" ? (
                <Attendees />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/home"
            element={
              isLoggedIn && role === "ADMIN" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin/users"
            element={
              isLoggedIn && role === "ADMIN" ? (
                <AdminUsers />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}
