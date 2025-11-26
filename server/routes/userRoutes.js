const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Inventory = require("../models/Inventory");
const Pet = require("../models/Pet");

// GET /api/user/inventory
// gets user's inventory
// private
router.get("/inventory", protect, async (req, res) => {
  try {
    let inventory = await Inventory.findOne({ userId: req.user._id });

    // Create inventory if it doesn't exist
    if (!inventory) {
      inventory = await Inventory.create({
        userId: req.user._id,
        coins: 100,
        items: [],
      });
    }

    res.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory",
    });
  }
});

router.post("/inventory/item", protect, async (req, res) => {
  const { itemId, name, quantity, type } = req.body;

  try {
    let inventory = await Inventory.findOne({ userId: req.user._id });

    if (!inventory) {
      inventory = await Inventory.create({
        userId: req.user._id,
        coins: 100,
        items: [],
      });
    }

    // Check if item already exists
    const existingItem = inventory.items.find((item) => item.itemId === itemId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      inventory.items.push({
        itemId,
        name,
        quantity: quantity || 1,
        type,
      });
    }

    await inventory.save();

    res.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to inventory",
    });
  }
});

// PUT /api/user/inventory/coins
// Updates user's coins
// private
router.put("/inventory/coins", protect, async (req, res) => {
  const { amount } = req.body;

  try {
    const inventory = await Inventory.findOne({ userId: req.user._id });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }

    inventory.coins += amount;
    if (inventory.coins < 0) inventory.coins = 0;

    await inventory.save();

    res.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Update coins error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating coins",
    });
  }
});

// GET /api/user/pets
// gets user's pets
// private
router.get("/pets", protect, async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user._id });

    res.json({
      success: true,
      pets,
    });
  } catch (error) {
    console.error("Get pets error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pets",
    });
  }
});

// POST /api/user/pets
// Creates a new pet
// private
router.post("/pets", protect, async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      success: false,
      message: "Please provide name and type",
    });
  }

  try {
    const pet = await Pet.create({
      userId: req.user._id,
      name,
      type,
    });

    res.status(201).json({
      success: true,
      pet,
    });
  } catch (error) {
    console.error("Create pet error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating pet",
    });
  }
});

// PUT /api/user/pets/:petId
// Update pet stats
// Private
router.put("/pets/:petId", protect, async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.petId,
      userId: req.user._id,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    // Update only allowed fields
    const allowedUpdates = ["happiness", "hunger", "experience", "level", "lastFed", "lastPlayed"];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        pet[key] = req.body[key];
      }
    });

    await pet.save();

    res.json({
      success: true,
      pet,
    });
  } catch (error) {
    console.error("Update pet error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating pet",
    });
  }
});

module.exports = router;