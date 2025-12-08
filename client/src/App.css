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
  const { itemId, name, quantity = 1, type, description } = req.body;

  try {
    let inventory = await Inventory.findOne({ userId: req.user._id });

    if (!inventory) {
      inventory = await Inventory.create({
        userId: req.user._id,
        coins: 100,
        items: [],
      });
    }

    const existingItem = inventory.items.find((item) => item.itemId === itemId);

    if (existingItem) {
      // Update quantity (can be + or -)
      existingItem.quantity += quantity;

      // Remove item if quantity is zero or below
      if (existingItem.quantity <= 0) {
        inventory.items = inventory.items.filter(
          (item) => item.itemId !== itemId
        );
      }
    } else {
      // No existing item; only allow creation if quantity > 0
      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot decrement item that is not in inventory",
        });
      }

      inventory.items.push({
        itemId,
        name,
        description,
        quantity,
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
      message: "Error updating inventory",
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

    const allowedUpdates = [
      "happiness",
      "hunger",
      "experience",
      "level",
      "lastFed",
      "lastPlayed",
    ];

    // Track if experience changed
    let experienceChanged = false;

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        pet[key] = req.body[key];
        if (key === "experience") {
          experienceChanged = true;
        }
      }
    });

    // Keep experience non-negative
    if (pet.experience < 0) pet.experience = 0;

    // If experience changed, try to level up
    if (experienceChanged && typeof pet.checkLevelUp === "function") {
      // In case of large EXP gains, allow multiple level ups
      while (pet.checkLevelUp()) {}
    }

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

router.post("/pets/:petId/feed", protect, async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({
      success: false,
      message: "itemId is required",
    });
  }

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

    const inventory = await Inventory.findOne({ userId: req.user._id });

    if (!inventory) {
      return res.status(400).json({
        success: false,
        message: "Inventory not found",
      });
    }

    const item = inventory.items.find((i) => i.itemId === itemId);

    if (!item || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "You don't have this item to feed",
      });
    }

    // Consume one item
    item.quantity -= 1;
    if (item.quantity <= 0) {
      inventory.items = inventory.items.filter((i) => i.itemId !== itemId);
    }

    // Apply effects to pet
    const happinessGain = 15;
    const expGain = 20;

    pet.happiness = Math.min(100, (pet.happiness || 0) + happinessGain);
    pet.experience = (pet.experience || 0) + expGain;

    // Level up if needed
    if (typeof pet.checkLevelUp === "function") {
      while (pet.checkLevelUp()) {}
    }

    await inventory.save();
    await pet.save();

    res.json({
      success: true,
      pet,
      inventory,
    });
  } catch (error) {
    console.error("Feed pet error:", error);
    res.status(500).json({
      success: false,
      message: "Error feeding pet",
    });
  }
});



module.exports = router;