// server/routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET /api/tasks - list all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// POST /api/tasks - create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const task = await Task.create({ title, description, deadline });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Error creating task" });
  }
});

module.exports = router;
