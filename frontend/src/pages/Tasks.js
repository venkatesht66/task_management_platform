import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

export default function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = [];
      if (q) params.push(`q=${encodeURIComponent(q)}`);
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      const url = "/tasks" + (params.length ? `?${params.join("&")}` : "");
      const res = await api(url, { method: "GET", token });
      setTasks(res?.data || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id));
  };

  return (
    <div className="content">
      {/* Page Header */}
      <div className="card">
        <h2 className="page-title">My Tasks</h2>
        <p className="muted">
          Search, filter, and manage your tasks efficiently
        </p>
      </div>
  
      {/* Filters */}
      <div className="card controls">
        <input
          placeholder="Search tasks..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
  
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
  
        <div className="controls-actions">
          <button onClick={load}>Search</button>
          <button><Link to="/tasks/new" className="btn-ghost">
            + New Task
          </Link></button>
          
        </div>
      </div>
  
      {/* Task List */}
      {loading ? (
        <div className="card">
          <Loader />
        </div>
      ) : tasks.length ? (
        <div className="task-list">
          {tasks.map((t) => (
            <TaskCard
              key={t._id || t.id}
              task={t}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <h3>No tasks yet</h3>
          <p className="muted">
            You haven’t created any tasks. Get started now.
          </p>
          <Link to="/tasks/new" className="btn-link">
            Create your first task 
          </Link>
        </div>
      )}
    </div>
  );
}