import React, { useState } from "react";
import api from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const resp = await api("/auth/login", { method: "POST", body: { email, password } });
      login(resp);
      nav("/");
    } catch (error) {
      console.error("Login failed", error);
      setErr(error.message || "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <form className="card form" onSubmit={submit} style={{minWidth:320,width:'100%',maxWidth:420}}>
        <h2>Login</h2>
        {err && <div className="alert">{err}</div>}
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <div style={{display:'flex',gap:8}}>
          <button type="submit" disabled={busy}>{busy ? "Logging..." : "Login"}</button>
          <Link to="/register" className="btn-ghost" style={{display:'inline-flex',alignItems:'center'}}>Register</Link>
        </div>
      </form>
    </div>
  );
}