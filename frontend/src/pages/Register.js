import React, { useState } from "react";
import api from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await api("/auth/register", { method: "POST", body: { name, email, password } });
      nav("/login");
    } catch (error) {
      console.error("Register failed", error);
      setErr(error.message || "Register failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="card card-lg">
        <h2 className="page-title">Create Account</h2>
        <p className="muted">Start managing your tasks efficiently</p>
  
        <form className="form" onSubmit={submit}>
          {err && <div className="alert">{err}</div>}
  
          <div className="form-group">
            <label>Full Name</label>
            <input
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Creating account..." : "Register"}
          </button>
  
          <div className="divider" />
  
          <p className="muted" style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" className="btn-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}