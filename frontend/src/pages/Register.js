import React, { useState } from "react";
import api from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await api("/auth/register", { method: "POST", body: { name, email, password } });
      nav("/login");
    } catch (error) {
      console.error("Register failed", error);
      setErr(error.message || "Register failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <form className="card form" onSubmit={submit} style={{minWidth:320,width:'100%',maxWidth:420}}>
        <h2>Create account</h2>
        {err && <div className="alert">{err}</div>}
        <label>Name
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <div style={{display:'flex',gap:8}}>
          <button type="submit" disabled={busy}>{busy ? "Registering..." : "Register"}</button>
          <Link to="/login" className="btn-ghost">Back to login</Link>
        </div>
      </form>
    </div>
  );
}