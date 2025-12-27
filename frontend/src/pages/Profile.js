import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { token, user, setUser } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || user?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api("/auth/me", { method: "GET", token });
        const data = res?.data || res || user;
        setMe(data);
        setName(data?.fullName || data?.name || "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user]);

  const saveName = async () => {
    if (!name.trim()) return setErr("Name cannot be empty");
    setSaving(true);
    setErr("");

    try {
      const res = await api("/auth/update-profile", {
        method: "PUT",
        body: { name },
        token,
      });

      const updated = res?.data || res;
      setMe(updated);
      setUser(updated);
      setEditing(false);
    } catch (e) {
      console.error(e);
      setErr("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="content">
      <div className="card profile-card" style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
        {/* Header */}
        <div
          className="profile-header"
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}
        >
          <div
            className="profile-avatar"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#1976d2",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {(me?.name || "U")[0].toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            {!editing ? (
              <>
                <h2 style={{ margin: 0 }}>{me?.name}</h2>
                <p className="muted" style={{ marginTop: 4 }}>
                  {me?.email}
                </p>
              </>
            ) : (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    fontSize: 16,
                  }}
                />
                {err && <div className="alert" style={{ marginTop: 6 }}>{err}</div>}
              </>
            )}
          </div>

          {!editing && (
            <button
              className="btn-ghost"
              onClick={() => setEditing(true)}
              style={{ padding: "6px 12px", fontSize: 14 }}
            >
              Edit
            </button>
          )}
        </div>

        {/* Actions */}
        {editing && (
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button
              onClick={saveName}
              disabled={saving}
              style={{ flex: 1, padding: "10px 0" }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setEditing(false);
                setName(me?.name || "");
                setErr("");
              }}
              style={{ flex: 1, padding: "10px 0" }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Details */}
        <div className="profile-details" style={{ borderTop: "1px solid #eee", paddingTop: 16 }}>
          <div className="profile-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="label" style={{ fontWeight: 500 }}>Email</span>
            <span>{me?.email}</span>
          </div>

          <div className="profile-row" style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="label" style={{ fontWeight: 500 }}>Member since</span>
            <span>{new Date(me?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}