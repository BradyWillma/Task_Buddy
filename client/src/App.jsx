// client/src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import PetPage from "./pages/PetPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { tasksAPI } from "./services/api";

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState("");

  // GET all tasks (only when authenticated)
  async function fetchTasks() {
    if (!isAuthenticated) return;

    try {
      setLoadingTasks(true);
      setTaskError("");
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      setTaskError("Failed to load tasks. Is the server running?");
    } finally {
      setLoadingTasks(false);
    }
  }

  // POST create task
  async function createTask(payload) {
    try {
      setTaskError("");
      const response = await tasksAPI.createTask(payload);
      setTasks((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error(err);
      setTaskError(err.response?.data?.message || "Failed to create task.");
    }
  }

  // PUT update task
  async function updateTask(id, updates) {
    try {
      const response = await tasksAPI.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
    } catch (err) {
      console.error(err);
      setTaskError(err.response?.data?.message || "Failed to update task.");
    }
  }

  // DELETE task
  async function deleteTask(id) {
    try {
      await tasksAPI.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setTaskError(err.response?.data?.message || "Failed to delete task.");
    }
  }

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchTasks();
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        {isAuthenticated && <Navbar />}

        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage
                  tasks={tasks}
                  loading={loadingTasks}
                  error={taskError}
                  onRefresh={fetchTasks}
                  onCreateTask={createTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage
                  tasks={tasks}
                  loading={loadingTasks}
                  error={taskError}
                  onRefresh={fetchTasks}
                  onCreateTask={createTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage
                  tasks={tasks}
                  loading={loadingTasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pet"
            element={
              <ProtectedRoute>
                {/* 🔹 pass tasks into PetPage so it can use the time-based memo */}
                <PetPage tasks={tasks} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
