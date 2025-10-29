import React from "react";
import { Link } from "react-router-dom";

export default function TaskCard({ task }) {
  return (
    <div className="task-card card">
      <div className="task-row">
        <h4 style={{margin:0}}>{task.title}</h4>
        <div className="tag">{task.priority || "medium"}</div>
      </div>
      <p className="muted" style={{marginTop:8}}>{task.description ? task.description.slice(0,120) : "No description"}</p>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
        <div className="muted">{task.status}</div>
        <Link to={`/tasks/${task._id || task.id}`} className="btn-link">Open</Link>
      </div>
    </div>
  );
}