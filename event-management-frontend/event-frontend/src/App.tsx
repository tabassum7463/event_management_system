// File: src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// User
import UserDashboard from "./pages/user/UserDashboard";
import EventList from "./pages/user/EventList";
import EventDetails from "./pages/user/EventDetails";
import MyBookings from "./pages/user/MyBookings";

// Organizer
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import OrganizerEventDetails from "./pages/organizer/OrganizerEventDetails";
import Attendees from "./pages/organizer/Attendees";

// Common
import Profile from "./pages/common/Profile";





type Role = "USER" | "ORGANIZER" | null;

type LoggedUser = {
  id: number;
  email: string;
  role: Role;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user: LoggedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setRole(user.role);
    }
  }, []);

  return (
    <>
      {isLoggedIn && role && <Navbar userRole={role} />}

      <Routes>
        {/* ---------- AUTH ---------- */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              role === "ORGANIZER" ? (
                <Navigate to="/organizer/home" />
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

        {/* ---------- USER ---------- */}
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

        <Route
          path="/events/:id"
          element={
            isLoggedIn ? <EventDetails /> : <Navigate to="/login" />
          }
        />

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

        {/* ---------- ORGANIZER ---------- */}
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







        {/* ---------- COMMON ---------- */}
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}