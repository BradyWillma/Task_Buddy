// server/models/Inventory.js
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        itemId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 0,
        },
        type: {
          type: String,
          required: true,
        },
        acquiredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    coins: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);