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
    <form className="card form" onSubmit={submit}>
      <h2>{editMode ? "Edit Task" : "Create Task"}</h2>
      {err && <div className="alert">{err}</div>}
      <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></label>
      <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></label>
      <label>Status
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label>Priority
        <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
      <label>Due date<input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} /></label>
      <div style={{display:'flex',gap:8}}>
        <button type="submit">Save</button>
        <button type="button" className="btn-ghost" onClick={()=>nav(-1)}>Cancel</button>
      </div>
    </form>
  );
}