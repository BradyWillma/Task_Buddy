// client/src/pages/PetPage.jsx

import { useEffect, useState, useMemo } from "react";
import { userAPI } from "../services/api";

const PET_ICONS = {
  cat: "🐱",
  dog: "🐶",
  penguin: "🐧",
};

const BACKGROUND_IMAGES = {
  "bg-cozy_room": "/src/images/cozy_room.png",
  "bg-park": "/src/images/park.png",
};

// I got tired of tryna make automatic implementation work, so hardcoding atm
const FOOD_IMAGES = {
  "food-carrot": "/src/images/food-carrot.png",
  "food-2": "/src/images/berry.png",
  "food-3": "/src/images/apple.png",
  "food-4": "/src/images/cookie.png",
  "food-5": "/src/images/cheese.png",
  "food-6": "/src/images/milk.png",
  "food-7": "/src/images/fish.png",
  "food-8": "/src/images/cracker.png",
  "food-9": "/src/images/fruit-cup.png",
  "food-10": "/src/images/sandwich.png",
  "food-11": "/src/images/soup.png",
  "food-12": "/src/images/cupcake.png",
  "food-13": "/src/images/chips.png",
  "food-14": "/src/images/trail-mix.png",
  "food-15": "/src/images/ramen.png",
  "food-16": "/src/images/pancakes.png",
  "food-17": "/src/images/donut.png",
  "food-18": "/src/images/golden-apple.png",
  "food-19": "/src/images/magic-berry.png",
  "food-20": "/src/images/fishes.png",
  "food-21": "/src/images/star-cookie.png",
  "food-22": "/src/images/sundae.png",
  "food-23": "/src/images/bento.png",
  "food-24": "/src/images/cake.png",
};

function PetPage({ tasks, selectedBackground, onBackgroundChange }) {
  const [pets, setPets] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [newPet, setNewPet] = useState({ name: "", type: "cat" });
  const [activeTab, setActiveTab] = useState("food");

  const currentPet = pets[0] || null;

  const { completedThisWeek, streak, timePetHappiness } = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const completedThisWeek = safeTasks.filter((task) => {
      if (!task.completed) return false;
      const completedDate = new Date(task.updatedAt || task.createdAt);
      return completedDate >= weekStart;
    }).length;

    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const hasCompletedTask = safeTasks.some((task) => {
        if (!task.completed) return false;
        const completedDate = new Date(task.updatedAt || task.createdAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === checkDate.getTime();
      });

      if (hasCompletedTask) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const timePetHappiness = Math.min(
      100,
      streak * 10 + completedThisWeek * 20
    );

    return { completedThisWeek, streak, timePetHappiness };
  }, [tasks]);

  const getTaskMoodText = () => {
    if (timePetHappiness >= 80) return "Your study buddy is thrilled!";
    if (timePetHappiness >= 40) return "Your study buddy is doing fine.";
    return "Your study buddy is feeling neglected...";
  };

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError("");

        const [petsRes, invRes] = await Promise.all([
          userAPI.getPets(),
          userAPI.getInventory(),
        ]);

        setPets(petsRes.data.pets || []);
        setInventory(invRes.data.inventory || null);
      } catch (err) {
        console.error("Failed to load pet screen", err);
        setError("Failed to load pet or inventory.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const foodItems = useMemo(() => {
    if (!inventory) return [];
    return (inventory.items || []).filter((item) =>
      item.itemId?.startsWith("food-")
    );
  }, [inventory]);

  const backgroundItems = useMemo(() => {
    if (!inventory) return [];
    return (inventory.items || []).filter((item) =>
      item.itemId?.startsWith("bg-")
    );
  }, [inventory]);

  const handleCreatePet = async (e) => {
    e.preventDefault();
    if (!newPet.name.trim()) return;

    try {
      setCreating(true);
      setError("");
      const res = await userAPI.createPet({
        name: newPet.name.trim(),
        type: newPet.type,
      });
      setPets((prev) => [...prev, res.data.pet]);
      setNewPet({ name: "", type: "cat" });
      setActionMessage("🎉 Pet created!");
      setTimeout(() => setActionMessage(""), 2000);
    } catch (err) {
      console.error("Failed to create pet", err);
      setError("Failed to create pet.");
    } finally {
      setCreating(false);
    }
  };

  const handlePlay = async (pet) => {
    try {
      setError("");
      const res = await userAPI.playWithPet(pet._id);
      const updated = res.data.pet;

      setPets((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

      setActionMessage("🐾 You played with your pet!");
      setTimeout(() => setActionMessage(""), 2000);
    } catch (err) {
      console.error("Failed to play with pet", err);
      setError("Failed to play with pet.");
    }
  };

  const handleFeed = async (pet, item) => {
    try {
      setError("");
      const res = await userAPI.feedPet(pet._id, item.itemId);

      const updatedPet = res.data.pet;
      const updatedInventory = res.data.inventory;

      setPets((prev) =>
        prev.map((p) => (p._id === updatedPet._id ? updatedPet : p))
      );
      setInventory(updatedInventory);

      setActionMessage(`🍽️ Fed ${pet.name} with ${item.name}!`);
      setTimeout(() => setActionMessage(""), 2000);
    } catch (err) {
      console.error("Failed to feed pet", err);
      setError("Failed to feed pet.");
    }
  };

  const handleSelectBackground = (bgId) => {
    onBackgroundChange(bgId);
    setActionMessage("🖼️ Background changed!");
    setTimeout(() => setActionMessage(""), 2000);
  };

  const handleRemoveBackground = () => {
    onBackgroundChange(null);
    setActionMessage("🖼️ Background removed!");
    setTimeout(() => setActionMessage(""), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-xl text-text-dark">Loading pet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-6 px-6 pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-dark mb-2">Your Pet</h1>
          <p className="text-text-light">
            Complete tasks and use items to keep your Study Buddy happy.
          </p>
        </div>

        {actionMessage && (
          <div className="mb-4 text-center py-2 px-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            {actionMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 text-center py-2 px-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!currentPet ? (
          <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-text-dark mb-4 text-center">
              Create your first pet
            </h2>
            <form onSubmit={handleCreatePet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Pet Name
                </label>
                <input
                  type="text"
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg bg-bg text-text-dark focus:outline-none focus:border-primary"
                  placeholder="e.g. Mochi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Pet Type
                </label>
                <select
                  value={newPet.type}
                  onChange={(e) =>
                    setNewPet((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg bg-bg text-text-dark focus:outline-none focus:border-primary"
                >
                  <option value="cat">Cat 🐱</option>
                  <option value="dog">Dog 🐶</option>
                  <option value="penguin">Penguin 🐧</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Pet"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6 flex flex-col items-center">
                <div className="relative w-full max-w-sm aspect-square mb-4 rounded-xl overflow-hidden">
                  {selectedBackground && BACKGROUND_IMAGES[selectedBackground] && (
                    <img
                      src={BACKGROUND_IMAGES[selectedBackground]}
                      alt="Pet background"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-9xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                      {PET_ICONS[currentPet.type] || "🐾"}
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-text-dark mb-1">
                  {currentPet.name}
                </h2>
                <p className="text-text-light mb-4 capitalize">
                  {currentPet.type}
                </p>

                <div className="w-full max-w-sm mb-4">
                  <div className="flex justify-between text-sm text-text-dark mb-1">
                    <span>Study Happiness</span>
                    <span>{timePetHappiness}%</span>
                  </div>
                  <div className="w-full bg-bg rounded-full h-3 shadow-[0_2px_1px_#c9c5bf]">
                    <div
                      className="bg-accent h-3 rounded-full transition-all duration-500"
                      style={{ width: `${timePetHappiness}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-light mt-2 text-center">
                    {getTaskMoodText()}
                  </p>
                  <p className="text-[11px] text-text-light mt-1 text-center">
                    Streak: {streak} day{streak === 1 ? "" : "s"} ·{" "}
                    Completed this week: {completedThisWeek}
                  </p>
                </div>

                <button
                  onClick={() => handlePlay(currentPet)}
                  className="btn-primary rounded-lg font-semibold hover:bg-primary-dark transition-all shadow-[0_4px_0_#5a86c4] active:translate-y-0.5"
                >
                  Play with {currentPet.name}
                </button>

                {currentPet.lastPlayed && (
                  <p className="mt-3 text-sm text-text-light">
                    Last played:{" "}
                    {new Date(currentPet.lastPlayed).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-text-dark">
                    Inventory
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-text-light">
                    <span>Coins:</span>
                    <img
                      src="/src/images/Coins.png"
                      alt="Coin"
                      className="coin-icon"
                    />
                    <span>{inventory?.coins ?? 0}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4 border-b-2 border-primary-light">
                  <button
                    onClick={() => setActiveTab("food")}
                    className={`px-4 py-2 font-semibold transition-all ${
                      activeTab === "food"
                        ? "text-primary border-b-2 border-primary -mb-0.5"
                        : "text-text-light hover:text-text-dark"
                    }`}
                  >
                    Food
                  </button>
                  <button
                    onClick={() => setActiveTab("backgrounds")}
                    className={`px-4 py-2 font-semibold transition-all ${
                      activeTab === "backgrounds"
                        ? "text-primary border-b-2 border-primary -mb-0.5"
                        : "text-text-light hover:text-text-dark"
                    }`}
                  >
                    Backgrounds
                  </button>
                </div>

                {activeTab === "food" && (
                  <>
                    {foodItems.length === 0 ? (
                      <p className="text-text-light text-sm">
                        You don't have any food yet. Visit the shop to buy snacks for
                        your pet!
                      </p>
                    ) : (
                      <div 
                        className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1" 
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#5a86c4 #e5e7eb' }}
                      >
                        {foodItems.map((item) => (
                          <div
                            key={item.itemId}
                            className="bg-bg rounded-xl p-4 shadow-[0_3px_2px_#c9c5bf] flex flex-col items-center text-center"
                          >
                            <div className="w-24 h-24 flex items-center justify-center mb-2 bg-bg-card rounded-lg overflow-hidden p-2">
                              <img
                                src={FOOD_IMAGES[item.itemId] || `/src/images/${item.itemId}.png`}
                                onError={(e) => {
                                  console.error(`Failed to load: ${e.target.src}`);
                                  e.target.style.display = "none";
                                }}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-sm font-semibold text-text-dark mb-1">
                              {item.name}
                            </div>
                            <div className="text-xs text-text-light mb-3">
                              Qty: {item.quantity}
                            </div>
                            <button
                              disabled={item.quantity <= 0}
                              onClick={() => handleFeed(currentPet, item)}
                              className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_3px_0_#5a86c4] active:translate-y-0.5"
                            >
                              Feed
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "backgrounds" && (
                  <>
                    {backgroundItems.length === 0 ? (
                      <p className="text-text-light text-sm">
                        You don't have any backgrounds yet. Visit the shop to buy
                        backgrounds for your pet!
                      </p>
                    ) : (
                      <div 
                        className="max-h-[500px] overflow-y-auto p-2" 
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#5a86c4 #e5e7eb' }}
                      >
                        {selectedBackground && (
                          <button
                            onClick={handleRemoveBackground}
                            className="w-full mb-4 px-4 py-2 bg-primary text-white rounded-lg text-sm transition-all   font-semibold hover:bg-primary-dark shadow-[0_4px_0_#5a86c4] active:translate-y-0.5"
                          >
                            Remove Background
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          {backgroundItems.map((item) => (
                            <div
                              key={item.itemId}
                              className={`bg-bg rounded-xl p-4 shadow-[0_3px_2px_#c9c5bf] flex flex-col items-center text-center cursor-pointer transition-all ${
                                selectedBackground === item.itemId
                                  ? "ring-4 ring-primary"
                                  : "hover:shadow-[0_4px_3px_#b5b1ab]"
                              }`}
                              onClick={() => handleSelectBackground(item.itemId)}
                            >
                              <div className="w-full aspect-square flex items-center justify-center mb-3 bg-bg-card rounded-lg overflow-hidden p-2">
                                <img
                                  src={BACKGROUND_IMAGES[item.itemId]}
                                  onError={(e) => (e.target.style.display = "none")}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="text-sm font-semibold text-text-dark mb-1">
                                {item.name}
                              </div>
                              {selectedBackground === item.itemId && (
                                <div className="text-xs text-primary font-semibold">
                                  ✓ Active
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
              <h3 className="text-xl font-semibold text-text-dark mb-4">
                Pet Stats
              </h3>

              <StatBar
                label="Level"
                value={currentPet.level || 1}
                max={10}
                text={`${currentPet.level || 1}`}
              />

              <StatBar
                label="Experience"
                value={currentPet.experience || 0}
                max={(currentPet.level || 1) * 100}
                text={`${currentPet.experience || 0} / ${
                  (currentPet.level || 1) * 100
                }`}
              />

              <StatBar
                label="Happiness"
                value={currentPet.happiness || 0}
                max={100}
                text={`${currentPet.happiness || 0}%`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatBar({ label, value, max, text }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1 text-text-dark">
        <span>{label}</span>
        <span>{text}</span>
      </div>
      <div className="w-full bg-bg rounded-full h-3 shadow-[0_2px_1px_#c9c5bf]">
        <div
          className="bg-accent h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default PetPage;