import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile(){
  const { token, user } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async ()=>{
      try {
        const res = await api("/auth/me", { method: "GET", token });
        setMe(res?.data || res || user);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    })();
  }, [token]);

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="card">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {me?.fullName || me?.name}</p>
      <p><strong>Email:</strong> {me?.email}</p>
      <p className="muted">Member since: {new Date(me?.createdAt || Date.now()).toLocaleDateString()}</p>
    </div>
  );
}