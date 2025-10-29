import React, { useRef, useState } from "react";

export default function FileUpload({ onFiles }) {
  const [active, setActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      console.log("Dropped files:", files);
      onFiles(files);
    }
  };

  const handleBrowse = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      console.log("Selected files:", files);
      onFiles(files);
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`dropzone ${active ? "active" : ""}`}
      onClick={openFileDialog}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(false);
      }}
      onDrop={handleDrop}
      style={{
        border: active ? "2px dashed #007bff" : "2px dashed #ccc",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.3s",
        marginTop: "10px",
      }}
    >
      <p style={{ margin: 0 }}>
        Drag & drop files here or{" "}
        <span style={{ color: "#007bff", textDecoration: "underline" }}>
          click to browse
        </span>
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleBrowse}
      />
    </div>
  );
}