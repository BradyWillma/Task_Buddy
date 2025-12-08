// server/models/Inventory.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    equipped: {
      type: Boolean,
      default: false,
    },
    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [itemSchema],
    coins: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
