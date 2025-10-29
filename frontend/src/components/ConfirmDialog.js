import React from "react";
export default function ConfirmDialog({ open, title = "Confirm", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h3>{title}</h3>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}