const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET /api/tasks - get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
});

// POST /api/tasks - create new task
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline, completed } = req.body;
    const task = await Task.create({
      title,
      description,
      deadline,
      completed,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res
      .status(400)
      .json({ message: "Error creating task", error: err.message });
  }
});

// PUT /api/tasks/:id - update a task (e.g. mark complete)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // e.g. { completed: true }

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true, // return updated task
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res
      .status(400)
      .json({ message: "Error updating task", error: err.message });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res
      .status(400)
      .json({ message: "Error deleting task", error: err.message });
  }
});

module.exports = router;
