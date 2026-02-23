import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/organizer/OrganizerEventDetails.css";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    navigate("/organizer/dashboard");

  } catch (error: any) {
    console.error("Full error:", error);

    if (error.response) {
      alert("❌ " + error.response.data);
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
    navigate("/organizer/dashboard");
  };

  if (!event || !formData) return <p>Loading...</p>;

  const bookedSeats = event.totalSeats - event.availableSeats;

  return (
    <div className="event-details-container">
      <div className="event-details-card">

        {editMode ? (
          <>
            <input name="title" value={formData.title} onChange={handleChange} />
            <textarea name="description" value={formData.description} onChange={handleChange} />
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
    <input
      name="category"
      value={formData.category}
      onChange={handleChange}
      placeholder="Category (e.g. Music, Tech, Workshop)"
    />

    <input
      name="city"
      value={formData.city}
      onChange={handleChange}
      placeholder="City (e.g. Mumbai, Delhi)"
    />

    <input
      type="date"
      name="eventDate"
      value={formData.eventDate}
      onChange={handleChange}
    />

    <input
      type="time"
      name="startTime"
      value={formData.startTime}
      onChange={handleChange}
    />

    <input
      type="time"
      name="endTime"
      value={formData.endTime}
      onChange={handleChange}
    />

    <input
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      placeholder="Ticket price in ₹"
      min="0"
    />

    <input
      type="number"
      name="totalSeats"
      value={formData.totalSeats}
      onChange={handleChange}
      placeholder="Total number of seats"
      min="1"
    />
  </>
) : (
            <>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>City:</strong> {event.city}</p>
              <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString("en-IN")}</p>
<p>
  <strong>Time:</strong>{" "}
  {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}{" "}
  -
  {" "}
  {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</p>           <p><strong>Price:</strong> ₹{event.price}</p>
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