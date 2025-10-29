import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import FileUpload from "../components/FileUpload";
import Loader from "../components/Loader";

export default function TaskDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const nav = useNavigate();

  const [task, setTask] = useState(null);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const t = await api(`/tasks/${id}`, { method: "GET", token });
      setTask(t?.data || t);

      const f = await api(`/files/task/${id}`, { method: "GET", token }).catch(
        () => ({ data: [] })
      );
      setFiles(f?.data || f || []);

      const c = await api(`/comments/tasks/${id}`, { method: "GET", token }).catch(
        () => ({ data: [] })
      );
      setComments(c?.data || c || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleFiles = async (list) => {
    try {
      const form = new FormData();
      list.forEach((f) => form.append("files", f));
      await api(`/files/upload/${id}`, {
        method: "POST",
        body: form,
        token,
        isForm: true,
      });
      loadAll();
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api(`/comments/tasks/${id}`, {
        method: "POST",
        body: { body: newComment },
        token,
      });
      setNewComment("");
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.body);
  };

  const saveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await api(`/comments/${commentId}`, {
        method: "PUT",
        body: { body: editText },
        token,
      });
      setEditingId(null);
      setEditText("");
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api(`/comments/${commentId}`, {
        method: "DELETE",
        token,
      });
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="card"><Loader /></div>;
  if (!task) return <div className="card">Task not found</div>;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{task.title}</h2>
        <div>
          <button onClick={() => nav(`/tasks/${id}/edit`)} className="btn-ghost">
            Edit
          </button>
        </div>
      </div>

      <p>{task.description || "No description"}</p>
      <div className="muted">
        Status: {task.status} • Priority: {task.priority}
      </div>

      <h4>Files</h4>
      {files.length ? (
        <ul>
          {files.map((f) => (
            <li key={f._id || f.id} style={{ marginBottom: 6 }}>
              <a
                href={`http://localhost:4000/${f.storagePath}`}
                target="_blank"
                rel="noreferrer"
              >
                {f.filename}
              </a>

              <span style={{ marginLeft: 10 }}>
                <a
                  href={`http://localhost:4000/${f.storagePath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>

                <button
                  className="btn-link"
                  style={{ color: "red" }}
                  onClick={async () => {
                    const fileId = f._id || f.id;
                    if (!fileId) return alert("No file ID provided");
                    if (!window.confirm("Are you sure you want to delete this file?")) return;

                    try {
                      const res = await api(`/files/${fileId}`, { method: "DELETE", token });
                      console.log("✅ Delete response:", res);

                      setFiles((prev) => prev.filter((x) => x._id !== fileId && x.id !== fileId));
                    } catch (e) {
                      alert("Delete failed");
                      console.error(e);
                    }
                  }}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No files</p>
      )}
      <FileUpload onFiles={handleFiles} />

      <h4>Comments</h4>
      <form onSubmit={postComment} className="form">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Post</button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        {comments.length ? (
          comments.map((c) => (
            <div key={c._id || c.id} className="comment">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>
                  {c.authorId?.fullName || c.authorId?.email || "User"}
                </strong>
                <span className="muted">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>

              {editingId === c._id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button type="button" onClick={() => saveEdit(c._id)}>
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{c.body}</p>
                  {c.authorId?._id === user?._id && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => deleteComment(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="muted">No comments yet</p>
        )}
      </div>
    </div>
  );
}