// File: src/pages/organizer/CreateEvent.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/organizer/CreateEvent.css";

interface EventForm {
  title: string;
  city: string;
  category: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  price: number | "";      // can be empty for placeholder
  totalSeats: number | ""; // can be empty for placeholder
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [form, setForm] = useState<EventForm>({
    title: "",
    city: "",
    category: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    price: "",
    totalSeats: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "totalSeats") {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    const errs: string[] = [];
   // const today = new Date();
    const selectedDate = form.eventDate ? new Date(form.eventDate) : null;

    if (!form.title.trim()) errs.push("Title is required.");
    if (!form.city.trim()) errs.push("City is required.");
    if (!form.category.trim()) errs.push("Category is required.");
    if (!form.description.trim()) errs.push("Description is required.");
    if (!form.eventDate) errs.push("Event date is required.");
    if (!form.startTime) errs.push("Start time is required.");
    if (!form.endTime) errs.push("End time is required.");
    if (form.price === "" || form.price <= 0)
      errs.push("Price must be greater than 0.");
    if (form.totalSeats === "" || form.totalSeats <= 0)
      errs.push("Total seats must be greater than 0.");

    if (selectedDate) {
      const todayOnly = new Date();
      todayOnly.setHours(0, 0, 0, 0);
      if (selectedDate < todayOnly) errs.push("Event date cannot be in the past.");
    }

    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      errs.push("Start time must be before end time.");

    // same-day past time check
    if (form.eventDate) {
      const todayStr = new Date().toISOString().split("T")[0];
      if (form.eventDate === todayStr) {
        const nowTime = new Date().toTimeString().slice(0, 5);
        if (form.startTime < nowTime) errs.push("Start time cannot be in the past.");
      }
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) {
      setErrors(["Organizer not found. Please login again."]);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      await api.post(`/api/events/organizer/${user.id}`, {
        ...form,
        availableSeats: form.totalSeats,
        organizer: { id: user.id }, 
      });

      alert("✅ Event created successfully!");

      
      setForm({
        title: "",
        city: "",
        category: "",
        description: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        price: "",
        totalSeats: "",
      });

      navigate("/organizer/home");
    } catch (err: any) {
      console.error("Create event error:", err);
      if (err.response?.data) setErrors([JSON.stringify(err.response.data)]);
      else setErrors(["Failed to create event. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <aside className="organizer-sidebar">
        <h2>Organizer Menu</h2>
        <button onClick={() => navigate("/organizer/home")}>📋 My Events</button>
        <button onClick={() => navigate("/organizer/create")}>➕ Create Event</button>
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
      </aside>

      <main className="create-event-main">
        <h1>Create New Event</h1>
        <p>Fill out the details below to create your event</p>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((err, i) => (
              <p key={i} className="error-text">
                {err}
              </p>
            ))}
          </div>
        )}

        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
            />
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              type="time"
              name="startTime"
              placeholder="Start Time"
              value={form.startTime}
              onChange={handleChange}
            />
            <input
              type="time"
              name="endTime"
              placeholder="End Time"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-row">
            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={form.price === 0 ? "" : form.price}
              onChange={handleChange}
              min="1"
            />
            <input
              type="number"
              name="totalSeats"
              placeholder="Total Seats"
              value={form.totalSeats === 0 ? "" : form.totalSeats}
              onChange={handleChange}
              min="1"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </main>
    </div>
  );
}