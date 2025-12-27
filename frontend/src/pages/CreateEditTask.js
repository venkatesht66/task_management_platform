import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CreateEditTask({ editMode }) {
  const { id } = useParams();
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", status: "open", priority: "medium", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (editMode && id) {
      (async () => {
        setLoading(true);
        try {
          const res = await api(`/tasks/${id}`, { method: "GET", token });
          const t = res?.data || res;
          setForm({
            title: t.title || "",
            description: t.description || "",
            status: t.status || "open",
            priority: t.priority || "medium",
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : ""
          });
        } catch (e) { console.error(e); setErr("Load failed"); }
        finally { setLoading(false); }
      })();
    }
  }, [editMode, id, token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Title required"); return; }
    setLoading(true);
    try {
      if (editMode) {
        await api(`/tasks/${id}`, { method: "PUT", body: form, token });
      } else {
        await api("/tasks", { method: "POST", body: form, token });
      }
      nav("/tasks");
    } catch (err) {
      console.error(err);
      setErr(err.message || "Save failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="content">
      <div className="card card-xl">
        <h2 className="page-title">
          {editMode ? "Edit Task" : "Create New Task"}
        </h2>
        <p className="muted">
          {editMode
            ? "Update task details and save changes"
            : "Fill in the details to create a new task"}
        </p>
  
        <form className="form" onSubmit={submit}>
          {err && <div className="alert">{err}</div>}
  
          <div className="form-group">
            <label>Title</label>
            <input
              placeholder="e.g. Prepare sprint report"
              value={form.title}
              onChange={e =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>
  
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Add task description..."
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
  
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={e =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="archived">Archived</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Priority</label>
            <select
              value={form.priority}
              onChange={e =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />
          </div>
  
          <div className="form-actions">
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Task"}
            </button>
  
            <button
              type="button"
              className="secondary"
              onClick={() => nav(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}