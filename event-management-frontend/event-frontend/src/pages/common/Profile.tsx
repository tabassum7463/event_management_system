import { useEffect, useState } from "react";
import "../../styles/pages/auth/Profile.css";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.username);
      setEmail(parsedUser.email);
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    if (!user) return;
    const updatedUser = { ...user, username, email };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditing(false);
  };

  if (loading) return <p className="profile-loading">Loading profile...</p>;
  if (!user) return <p className="profile-loading">No user logged in.</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
        {editing ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="edit-input"
              placeholder="Username"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="edit-input"
              placeholder="Email"
            />
          </>
        ) : (
          <>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-role">{user.role}</p>
          </>
        )}

        <div className="profile-details">
          <div className="detail-row">
            <span className="label">Username</span>
            <span className="value">{user.username}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="label">Role</span>
            <span className="value">{user.role}</span>
          </div>
        </div>

        {editing ? (
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button className="edit-btn save-btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="edit-btn cancel-btn"
              onClick={() => {
                setUsername(user.username);
                setEmail(user.email);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}