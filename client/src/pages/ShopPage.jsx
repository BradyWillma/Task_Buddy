// client/src/pages/ShopPage.jsx
import { useState, useMemo, useEffect } from "react";
import { userAPI } from "../services/api";

const ALL_ITEMS = [
  {
    id: "hat-1",
    name: "Blue Beanie",
    category: "Clothes",
    price: 120,
    image: "",
    rarity: "common",
  },
  {
    id: "bow-1",
    name: "Pink Bow",
    category: "Clothes",
    price: 150,
    image: "",
    rarity: "rare",
  },
  {
    id: "scarf-1",
    name: "Cozy Scarf",
    category: "Clothes",
    price: 200,
    image: "",
    rarity: "rare",
  },
  {
    id: "food-1",
    name: "Carrot",
    category: "Food",
    price: 80,
    image: "",
    rarity: "common",
  },
  {
    id: "food-2",
    name: "Berry Treat",
    category: "Food",
    price: 80,
    image: "",
    rarity: "common",
  },
  {
    id: "toy-1",
    name: "Yarn Ball",
    category: "Accessories",
    price: 100,
    image: "",
    rarity: "common",
  },
  {
    id: "bg-forest",
    name: "Forest Background",
    category: "Backgrounds",
    price: 300,
    image: "",
    rarity: "epic",
  },
  {
    id: "bg-room",
    name: "Cozy Room",
    category: "Backgrounds",
    price: 280,
    image: "",
    rarity: "rare",
  },
];

const CATEGORIES = ["All", "Clothes", "Food", "Accessories", "Backgrounds"];

export default function ShopPage() {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [purchaseMessage, setPurchaseMessage] = useState("");

  // Fetches inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userAPI.getInventory();
      setInventory(response.data.inventory);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return ALL_ITEMS;
    return ALL_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleBuy = async (item) => {
    // Check if already owned
    if (isOwned(item)) {
      setPurchaseMessage("You already own this item!");
      setTimeout(() => setPurchaseMessage(""), 2000);
      return;
    }

    // Check if enough coins
    if (inventory.coins < item.price) {
      setPurchaseMessage("Not enough coins!");
      setTimeout(() => setPurchaseMessage(""), 2000);
      return;
    }

    try {
      setError("");
      
      // Deduct coins
      await userAPI.updateCoins(-item.price);
      
      // Add item to inventory
      await userAPI.addItem({
        itemId: item.id,
        name: item.name,
        quantity: 1,
        type: item.category,
      });

      // Update local state
      setInventory((prev) => ({
        ...prev,
        coins: prev.coins - item.price,
        items: [
          ...prev.items,
          {
            itemId: item.id,
            name: item.name,
            quantity: 1,
            type: item.category,
          },
        ],
      }));

      setPurchaseMessage(`✅ Purchased ${item.name}!`);
      setTimeout(() => setPurchaseMessage(""), 2000);
    } catch (err) {
      console.error("Error purchasing item:", err);
      setError("Failed to purchase item");
      setPurchaseMessage("Purchase failed!");
      setTimeout(() => setPurchaseMessage(""), 2000);
    }
  };

  const isOwned = (item) => {
    if (!inventory) return false;
    return inventory.items.some((invItem) => invItem.itemId === item.id);
  };

  function rarityTagColor(rarity) {
    switch (rarity) {
      case "epic":
        return "bg-primary-dark text-white";
      case "rare":
        return "bg-primary-light text-dark";
      default:
        return "bg-bg-card text-light";
    }
  }

  if (loading) {
    return (
      <div className="bg-bg min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center">Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* SHOP HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark">Shop</h1>
            <p className="text-light text-sm mt-1">
              Buy food, clothing, and accessories for your pet.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* COIN DISPLAY */}
            <div className="flex items-center gap-2 bg-bg-card border border-primary-light px-3 py-1.5 rounded-full shadow-sm">
              <img
                src="/src/images/Coins.png"
                alt="Coins"
                className="coin-icon"
              />
              <span className="text-dark font-semibold text-sm">
                {inventory?.coins || 0}
              </span>
            </div>

            {/* PET PREVIEW */}
            <div className="flex items-center gap-3 bg-bg-card border border-primary-light px-3 py-2 rounded-xl shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center bg-bg rounded-lg">
                <img src="/pet.png" alt="Pet" className="w-8 h-8" />
              </div>
              <div>
                <p className="text-dark text-sm font-semibold">Your Pet</p>
                <p className="text-light text-xs">
                  {inventory?.items.length || 0} items owned
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PURCHASE MESSAGE */}
        {purchaseMessage && (
          <div className="mb-4 text-center py-2 px-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            {purchaseMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 text-center py-2 px-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "px-3 py-1.5 rounded-full text-sm border transition " +
                  (isActive
                    ? "bg-primary text-white border-primary shadow"
                    : "bg-bg-card text-dark border-primary-light hover:bg-primary-light/50")
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ITEMS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const owned = isOwned(item);
            const notEnough = (inventory?.coins || 0) < item.price;

            return (
              <div
                key={item.id}
                className="bg-bg-card border border-primary-light rounded-xl p-4 shadow-sm flex flex-col items-center transition"
              >
                <div className="w-20 h-20 flex items-center justify-center mb-3 bg-bg rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-16 h-16" />
                </div>

                <h3 className="text-dark font-semibold text-sm text-center">
                  {item.name}
                </h3>
                <p className="text-light text-xs">{item.category}</p>

                <span
                  className={
                    "mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium " +
                    rarityTagColor(item.rarity)
                  }
                >
                  {item.rarity.toUpperCase()}
                </span>

                <div className="flex items-center gap-1 mt-2 text-dark text-sm">
                  <img
                    src="/src/images/Coins.png"
                    alt="Coin"
                    className="coin-icon"
                  />
                  <span>{item.price}</span>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={owned || notEnough}
                  className={
                    "mt-3 w-full py-1.5 rounded text-sm font-semibold transition " +
                    (owned
                      ? "bg-bg text-light border border-primary-light cursor-default"
                      : notEnough
                      ? "bg-bg-card text-light border border-primary-light cursor-not-allowed opacity-70"
                      : "bg-primary text-white hover:bg-primary-dark")
                  }
                >
                  {owned ? "Owned" : notEnough ? "Not enough coins" : "Buy"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}