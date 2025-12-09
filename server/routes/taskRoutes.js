const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Inventory = require("../models/Inventory");
const { protect } = require("../middleware/auth");

// Apply authentication to all task routes
router.use(protect);

// GET all tasks for the authenticated user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = await Task.create({
      userId: req.user._id,
      title,
      description,
      deadline,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update a task
router.put("/:id", async (req, res) => {
  try {

    const taskId = req.params.id;

    if (!taskId || taskId === "undefined") {
      console.error("Task update called with invalid id:", taskId);
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });


    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const wasCompleted = task.completed;
    const { title, description, deadline, completed } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) task.deadline = deadline;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    let reward = 0;

    if (!wasCompleted && completed === true) {
      reward = 10; 
      const inventory = await Inventory.findOne({ userId: req.user._id });
      if (inventory) {
        inventory.coins += reward;
        await inventory.save();
      }
    }

    res.json({ task, reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;