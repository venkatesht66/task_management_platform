const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

export default async function api(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};
  let opts = { method };

  if (!isForm) {
    headers["Content-Type"] = "application/json";
    if (body) opts.body = JSON.stringify(body);
  } else {
    opts.body = body;
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  opts.headers = headers;

  const res = await fetch(`${API_BASE}${path}`, opts);

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = undefined;
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}