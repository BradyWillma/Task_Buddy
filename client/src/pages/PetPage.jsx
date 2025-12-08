// client/src/pages/PetPage.jsx
import { useEffect, useState, useMemo } from "react";
import { userAPI } from "../services/api";

const PET_ICONS = {
  cat: "🐱",
  dog: "🐶",
  penguin: "🐧",
};

function PetPage() {
  const [pets, setPets] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [newPet, setNewPet] = useState({ name: "", type: "cat" });

  const currentPet = pets[0] || null;

  // Load pets + inventory on mount
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
    // Use food items by id prefix (food-*)
    return (inventory.items || []).filter((item) =>
      item.itemId?.startsWith("food-")
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
      // Just add some experience & update lastPlayed; backend will handle level up and XP rollover
      const newExperience = (pet.experience || 0) + 20;
      const res = await userAPI.updatePet(pet._id, {
        happiness: Math.min(100, (pet.happiness || 0) + 10),
        experience: newExperience,
        lastPlayed: new Date(),
      });

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
          // No pet yet → show create form
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
            {/* Top row: pet + stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6 flex flex-col items-center">
                <div className="text-7xl mb-4">
                  {PET_ICONS[currentPet.type] || "🐾"}
                </div>
                <h2 className="text-2xl font-bold text-text-dark mb-1">
                  {currentPet.name}
                </h2>
                <p className="text-text-light mb-4 capitalize">
                  {currentPet.type}
                </p>

                <button
                  onClick={() => handlePlay(currentPet)}
                  className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all shadow-[0_4px_0_#5a86c4] active:translate-y-0.5"
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
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Stats
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
            </div>

            {/* Food inventory */}
            <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-dark">
                  Food Inventory
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

              {foodItems.length === 0 ? (
                <p className="text-text-light text-sm">
                  You don’t have any food yet. Visit the shop to buy snacks for
                  your pet!
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {foodItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="bg-bg rounded-xl p-3 shadow-[0_3px_2px_#c9c5bf] flex flex-col items-center text-center"
                    >
                      <div className="w-14 h-14 flex items-center justify-center mb-2 bg-bg-card rounded-lg overflow-hidden">
                        {/* reuse shop images naming */}
                        <img
                          src={`/src/images/${item.itemId.replace(
                            "food-",
                            ""
                          )}.png`}
                          onError={(e) => (e.target.style.display = "none")}
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="text-sm font-semibold text-text-dark">
                        {item.name}
                      </div>
                      <div className="text-xs text-text-light mb-2">
                        Qty: {item.quantity}
                      </div>
                      <button
                        disabled={item.quantity <= 0}
                        onClick={() => handleFeed(currentPet, item)}
                        className="mt-auto px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Feed
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
