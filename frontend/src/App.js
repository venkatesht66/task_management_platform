import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import CreateEditTask from "./pages/CreateEditTask";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function Private({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <Private>
            <Layout>
              <Dashboard />
            </Layout>
          </Private>
        }
      />
      <Route
        path="/tasks"
        element={
          <Private>
            <Layout>
              <Tasks />
            </Layout>
          </Private>
        }
      />
      <Route
        path="/tasks/new"
        element={
          <Private>
            <Layout>
              <CreateEditTask />
            </Layout>
          </Private>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <Private>
            <Layout>
              <TaskDetail />
            </Layout>
          </Private>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={
          <Private>
            <Layout>
              <CreateEditTask editMode />
            </Layout>
          </Private>
        }
      />
      <Route
        path="/profile"
        element={
          <Private>
            <Layout>
              <Profile />
            </Layout>
          </Private>
        }
      />
      <Route
        path="/analytics"
        element={
          <Private>
            <Layout>
              <Analytics />
            </Layout>
          </Private>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}