// client/src/pages/PetPage.jsx
import { useEffect, useState } from "react";
import { userAPI } from "../services/api";

const PET_ICONS = {
  cat: "🐱",
  dog: "🐶",
  penguin: "🐧",
};

function PetPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newPet, setNewPet] = useState({ name: "", type: "cat" });
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchPets() {
      try {
        setError("");
        setLoading(true);
        const res = await userAPI.getPets();
        setPets(res.data.pets || []);
      } catch (err) {
        console.error("Failed to load pets", err);
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

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
      const newHappiness = Math.min(100, (pet.happiness || 0) + 15);
      const newExp = (pet.experience || 0) + 20;

      const res = await userAPI.updatePet(pet._id, {
        happiness: newHappiness,
        experience: newExp,
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

  const currentPet = pets[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-xl text-text-dark">Loading pet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-6 px-6 pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-dark mb-2">Your Pet</h1>
          <p className="text-text-light">
            Complete tasks and care for your Study Buddy pet.
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
          // Pet exists → show stats & actions
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                max={currentPet.level * 100 || 100}
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

              {currentPet.lastPlayed && (
                <p className="mt-4 text-sm text-text-light">
                  Last played:{" "}
                  {new Date(currentPet.lastPlayed).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBar({ label, value, max, text }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

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