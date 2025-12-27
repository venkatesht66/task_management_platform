import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function Login() {
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) nav("/");
  }, [token, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const resp = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Save token and user persistently
      login(resp);

      // Redirect after successful login
      nav("/");
    } catch (error) {
      console.error("Login failed", error);
      setErr(error.message || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card card-lg" style={{ maxWidth: 400, width: "90%" }}>
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Welcome Back</h2>
        <p className="muted" style={{ textAlign: "center", marginBottom: 20 }}>
          Login to manage your tasks
        </p>

        {err && <div className="alert">{err}</div>}

        <form className="form" onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary"
            disabled={busy}
            style={{ marginTop: 16 }}
          >
            {busy ? "Logging in..." : "Login"}
          </button>

          <div className="divider" style={{ margin: "20px 0" }} />

          <p className="muted" style={{ textAlign: "center" }}>
            Don’t have an account?{" "}
            <Link to="/register" className="btn-link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}