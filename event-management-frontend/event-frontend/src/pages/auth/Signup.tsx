import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/auth/Auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- FRONTEND PASSWORD VALIDATION ---
const validatePassword = (password: string): string | null => {
  const trimmed = password.trim();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,64}$/;

  if (!passwordRegex.test(trimmed)) {
    return "Password must be 8–64 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
  }

  if (/\s/.test(trimmed)) {
    return "Password must not contain spaces.";
  }

  return null;
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/signup", {
        username,
        email,
        password
      });

      if (res.data === "User already exists") {
        setError(res.data);
      } else {

        setUsername("");
        setEmail("");
        setPassword("");

        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Create Account</h2>
        <p className="subtitle">Sign up as a user</p>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}