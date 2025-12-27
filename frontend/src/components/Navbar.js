import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { Menu, X } from "lucide-react";

export default function Navbar({ open, onToggle }) {
  const { token, user, logout } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async ()=>{
      try {
        const res = await api("/auth/me", { method: "GET", token });
        setMe(res?.data || res || user);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    })();
  }, [token]);
  const nav = useNavigate();

  return (
    <header className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* ✅ HAMBURGER BUTTON */}
        <button
          className="menu-btn"
          onClick={onToggle}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Desktop title */}
        <button
          className="btn-ghost show-desktop"
          onClick={() => nav("/")}
        >
          Task Manager
        </button>

        {/* Mobile greeting */}
        {user && (
          <div className="show-mobile muted" style={{ fontWeight: 600 }}>
            Hi, {me.name}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && <div className="muted hide-mobile">Hi, {me.name}</div>}
        <button onClick={() => { logout(); nav("/login"); }}>Logout</button>
      </div>
    </header>
  );
}