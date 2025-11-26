const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    type: {
      type: String,
      required: true,
      enum: ["cat", "dog", "penguin"], // Current pets, add more whenever necessary (chick? bear?)
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    happiness: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastPlayed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Method to level up pet
petSchema.methods.checkLevelUp = function() {
  const expNeeded = this.level * 100; // Currently 100xp per level, maybe will add level scaling like an rpg but a lot less scaled (1.05?)
  if (this.experience >= expNeeded) {
    this.level += 1;
    this.experience -= expNeeded;
    return true;
  }
  return false;
};

// Method to decay happiness over time
petSchema.methods.updateHappiness = function() {
  const hoursSincePlay = (Date.now() - this.lastPlayed) / (1000 * 60 * 60);
  const decay = Math.floor(hoursSincePlay * 2); // Lose 2 happiness per hour
  this.happiness = Math.max(0, this.happiness - decay);
};

module.exports = mongoose.model("Pet", petSchema);