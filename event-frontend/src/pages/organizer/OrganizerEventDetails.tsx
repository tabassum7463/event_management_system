import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/organizer/OrganizerEventDetails.css";
import { EVENT_CATEGORIES } from "../../constants/eventCategories";

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
  organizerName: string;
}

export default function OrganizerEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    const res = await api.get(`/api/events/${id}`);
    setEvent(res.data);
    setFormData(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/api/events/organizer/update/${id}`, formData);
      alert("✅ Event updated successfully!");
      navigate("/organizer/home");
    } catch (error: any) {
      console.error("Full error:", error);
      if (error.response) {
        alert("❌ " + error.response.data.message);
      } else {
        alert("❌ Something went wrong!");
      }
    }
  };

  const handleCancel = () => {
    setFormData(event);
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;
    await api.delete(`/api/events/organizer/${id}`);
    navigate("/organizer/home");
  };

  if (!event || !formData) return <p>Loading...</p>;

  const bookedSeats = event.totalSeats - event.availableSeats;
  const canEditAll = bookedSeats === 0;

  const isFieldEditable = (field: keyof Event) => {
    if (canEditAll) return true;
    return ["description", "price", "endTime"].includes(field);
  };

  const inputClass = (field: keyof Event) => 
    editMode ? (isFieldEditable(field) ? "editable-field" : "disabled-field") : "";

  return (
    <div className="event-details-container">
      <div className="event-details-card">

        {editMode ? (
          <>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!isFieldEditable("title")}
              className={inputClass("title")}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!isFieldEditable("description")}
              className={inputClass("description")}
            />
          </>
        ) : (
          <>
            <h1>{event.title}</h1>
            <p className="description">{event.description}</p>
          </>
        )}

        <div className="details-grid">

          {editMode ? (
            <>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={!isFieldEditable("category")}
                className={inputClass("category")}
              >
                {!EVENT_CATEGORIES.some((cat) => cat === formData.category) && (
                  <option value={formData.category}>{formData.category}</option>
                )}
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City (e.g. Mumbai, Delhi)"
                disabled={!isFieldEditable("city")}
                className={inputClass("city")}
              />

              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                disabled={!isFieldEditable("eventDate")}
                className={inputClass("eventDate")}
              />

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                disabled={!isFieldEditable("startTime")}
                className={inputClass("startTime")}
              />

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                disabled={!isFieldEditable("endTime")}
                className={inputClass("endTime")}
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ticket price in ₹"
                min="0"
                disabled={!isFieldEditable("price")}
                className={inputClass("price")}
              />

              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="Total number of seats"
                min="1"
                disabled={!isFieldEditable("totalSeats")}
                className={inputClass("totalSeats")}
              />
            </>
          ) : (
            <>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>City:</strong> {event.city}</p>
              <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString("en-IN")}</p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString("en-IN", {hour: "2-digit", minute: "2-digit", hour12: true})} -{" "}
                {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString("en-IN", {hour: "2-digit", minute: "2-digit", hour12: true})}
              </p>
              <p><strong>Price:</strong> ₹{event.price}</p>
              <p><strong>Total Seats:</strong> {event.totalSeats}</p>
              <p><strong>Available Seats:</strong> {event.availableSeats}</p>
              <p><strong>Booked Seats:</strong> {bookedSeats}</p>
              <p><strong>Organizer:</strong> {event.organizerName}</p>
            </>
          )}

        </div>

        <div className="action-buttons">
          {editMode ? (
            <>
              <button onClick={handleSave}> Save</button>
              <button onClick={handleCancel}> Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>🗑 Delete</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
