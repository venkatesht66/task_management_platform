import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

export default function Tasks(){
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
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="card controls">
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <div style={{display:'flex', gap:8}}>
          <button onClick={load}>Search</button>
          <Link to="/tasks/new" className="btn-ghost">New Task</Link>
        </div>
      </div>

      <div>
        {loading ? <div className="card"><Loader/></div> : (
          tasks.length ? tasks.map(t => <TaskCard key={t._id || t.id} task={t} />) : (
            <div className="card">No tasks. <Link to="/tasks/new">Create one</Link></div>
          )
        )}
      </div>
    </div>
  );
}