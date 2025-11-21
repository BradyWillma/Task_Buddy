const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET /api/tasks
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

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const task = await Task.create({ title, description, deadline });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res
      .status(400)
      .json({ message: "Error creating task", error: err.message });
  }
});

module.exports = router;
