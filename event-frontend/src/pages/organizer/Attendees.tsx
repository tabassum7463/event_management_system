import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/organizer/Attendees.css";
import OrganizerSidebar from "../../components/OrganizerSidebar";

interface Attendee {
  bookingId: number;
  name: string;
  email: string;
  quantity: number;
}

export default function Attendees() {
  const { eventId } = useParams<{ eventId: string }>();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalBookings = attendees.length;
  const totalTickets = attendees.reduce((sum, attendee) => sum + attendee.quantity, 0);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID not found.");
      setLoading(false);
      return;
    }

    const fetchAttendees = async () => {
      try {
        const res = await api.get<Attendee[]>(`/api/bookings/event/${eventId}/attendees`);
        setAttendees(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch attendees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  return (
    <div className="attendees-container">
      <OrganizerSidebar />

      <main className="attendees-main">
        <h1>Attendees for Event</h1>

        {loading && <p>Loading attendees...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && attendees.length === 0 && <p>No attendees have booked this event yet.</p>}

        {!loading && attendees.length > 0 && (
          <div className="attendees-summary">
            <div className="summary-card">
              <h3>Total Bookings</h3>
              <p>{totalBookings}</p>
            </div>

            <div className="summary-card">
              <h3>Total Tickets Sold</h3>
              <p>{totalTickets}</p>
            </div>
          </div>
        )}

        {!loading && attendees.length > 0 && (
          <table className="attendees-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Tickets</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((att, index) => (
                <tr key={att.bookingId}>
                  <td>{index + 1}</td>
                  <td>{att.name}</td>
                  <td>{att.email}</td>
                  <td>{att.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
