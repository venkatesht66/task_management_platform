import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">Task Manager</div>
      <nav style={{marginTop:8}}>
        <NavLink to="/" className="side-link">Dashboard</NavLink>
        <NavLink to="/tasks" className="side-link">Tasks</NavLink>
        <NavLink to="/tasks/new" className="side-link">Create Task</NavLink>
        <NavLink to="/analytics" className="side-link">Analytics</NavLink>
        <NavLink to="/profile" className="side-link">Profile</NavLink>
      </nav>
      <div style={{flex:1}} />
      <div className="muted" style={{fontSize:12, marginTop:12}}>Simple & Responsive</div>
    </aside>
  );
}