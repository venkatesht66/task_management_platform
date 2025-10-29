import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";

export function StatusPie({ data }) {
  const colors = ["#1976d2","#ff9800","#4caf50","#e91e63"];
  const formatted = (data || []).map(d => ({ name: d._id || d.name, value: d.count || d.value }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={formatted} dataKey="value" nameKey="name" outerRadius={80} label>
          {formatted.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data }) {
  const rows = (data || []).map(r => ({ date: r._id || r.date, count: r.count || r.value }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#1976d2" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function UserBar({ data }) {
  const rows = (data || []).map(r => ({ user: r._id || r.user, completed: r.completed || r.count || 0, overdue: r.overdue || 0 }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="user" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#4caf50" />
        <Bar dataKey="overdue" fill="#e91e63" />
      </BarChart>
    </ResponsiveContainer>
  );
}