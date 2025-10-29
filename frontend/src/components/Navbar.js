import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="navbar">
      <div>
        <button className="btn-ghost" onClick={() => nav("/")}>Task Manager</button>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        {user && <div className="muted">Hi, {user.fullName || user.name || user.email}</div>}
        {user ? <button onClick={() => { logout(); nav("/login"); }}>Logout</button> : <button onClick={() => nav("/login")}>Login</button>}
      </div>
    </header>
  );
}