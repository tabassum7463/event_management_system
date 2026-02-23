import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/auth/Auth.css";

interface LoginProps {
  onLogin?: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

     
      localStorage.setItem("user", JSON.stringify(res.data));

      onLogin && onLogin(res.data);

  
      setEmail("");
      setPassword("");

      if (res.data.role === "USER") navigate("/user/home");
      else if (res.data.role === "ORGANIZER") navigate("/organizer/home");
    } catch (err: any) {
      setError(err.response?.data || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}