import adminHeroImage from "../../assets/event1.png";
import "../../styles/components/admin/AdminHero.css";

interface AdminHeroProps {
  onManageUsers: () => void;
  onCreateUser: () => void;
}

export default function AdminHero({ onManageUsers, onCreateUser }: AdminHeroProps) {
  return (
    <section className="admin-hero" style={{ backgroundImage: `url(${adminHeroImage})` }}>
      <div className="admin-hero-overlay">
        <p className="admin-hero-eyebrow">EVENTSPHERE ADMIN CONSOLE</p>
        <h2>Manage Your Event Platform with Confidence</h2>
        <p>
          Control users, assign roles, and keep organizer operations smooth
          from one centralized dashboard.
        </p>
        <div className="admin-hero-actions">
          <button type="button" onClick={onManageUsers}>Manage Users</button>
          <button type="button" className="secondary-hero-btn" onClick={onCreateUser}>Create User</button>
        </div>
      </div>
    </section>
  );
}
