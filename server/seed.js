require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Task = require("./models/Task");
const Inventory = require("./models/Inventory");
const Pet = require("./models/Pet");

async function seed() {
  try {
    await connectDB();

    console.log("Clearing existing seed user if present...");
    await User.deleteOne({ email: "demo@example.com" });

    const user = await User.create({
      username: "demo",
      email: "demo@example.com",
      password: "password123",
    });

    await Inventory.create({
      userId: user._id,
      coins: 200,
      items: [],
    });

    await Task.create([
      {
        userId: user._id,
        title: "Finish statics homework",
        description: "Chapter 7 problems 1–10",
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        title: "Study for calculus exam",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    ]);

    await Pet.create({
      userId: user._id,
      name: "Mochi",
      type: "cat",
    });

    console.log("✅ Seed data created.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
