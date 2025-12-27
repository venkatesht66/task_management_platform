import React from "react";
import { NavLink } from "react-router-dom";
import { Home, List, PlusCircle, BarChart2, User } from "lucide-react";

export default function Sidebar({ open, onClose }) {
  const links = [
    { to: "/", label: "Dashboard", icon: <Home size={18}/> },
    { to: "/tasks", label: "Tasks", icon: <List size={18}/> },
    { to: "/tasks/new", label: "Create Task", icon: <PlusCircle size={18}/> },
    { to: "/analytics", label: "Analytics", icon: <BarChart2 size={18}/> },
    { to: "/profile", label: "Profile", icon: <User size={18}/> },
  ];

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">Task Manager</div>
        <nav style={{ marginTop: 12 }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="side-link" onClick={onClose}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {l.icon} {l.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ padding: 18, color: 'var(--muted)', fontSize: 12 }}>
          © {new Date().getFullYear()} • <span style={{color:'var(--accent)'}}>Venkatesh T</span> • Built with ❤️
        </div>
      </aside>

      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}