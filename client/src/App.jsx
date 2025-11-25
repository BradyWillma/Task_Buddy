import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import PetPage from "./pages/PetPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import Navbar from "./components/Navbar";

const API_BASE = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState("");

  // GET all tasks
  async function fetchTasks() {
    try {
      setLoadingTasks(true);
      setTaskError("");
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setTasks(data);
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
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed: ${res.status}`);
      }
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error(err);
      setTaskError(err.message || "Failed to create task.");
    }
  }

  // PUT update task (toggle complete etc.)
  async function updateTask(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error(err);
      setTaskError(err.message || "Failed to update task.");
    }
  }

  // DELETE task
  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setTaskError(err.message || "Failed to delete task.");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                tasks={tasks}
                loading={loadingTasks}
                error={taskError}
                onRefresh={fetchTasks}
                onCreateTask={createTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            }
          />
          <Route
            path="/home"
            element={
              <HomePage
                tasks={tasks}
                loading={loadingTasks}
                error={taskError}
                onRefresh={fetchTasks}
                onCreateTask={createTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            }
          />
          <Route
            path="/calendar"
            element={<CalendarPage tasks={tasks} loading={loadingTasks} />}
          />
          <Route path="/pet" element={<PetPage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;