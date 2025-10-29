import React from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function TaskCard({ task, onDelete }) {
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const taskId = task._id || task.id;
      await api(`/tasks/${taskId}`, { method: "DELETE", token });
      if (onDelete) onDelete(taskId);
    } catch (e) {
      console.error(e);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="task-card card">
      <div className="task-row">
        <h4 style={{ margin: 0 }}>{task.title}</h4>
        <div className="tag">{task.priority || "medium"}</div>
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        {task.description ? task.description.slice(0, 120) : "No description"}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <div className="muted">{task.status}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/tasks/${task._id || task.id}`} className="btn-link">
            Open
          </Link>
          <button
            className="btn-link"
            style={{ color: "red",marginTop: "-8px",fontSize:"15px" }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}