// client/src/pages/ShopPage.jsx
import { useState, useMemo, useEffect } from "react";
import { userAPI } from "../services/api";

const ALL_ITEMS = [
  {
    id: "hat-1",
    name: "Blue Beanie",
    category: "Clothes",
    price: 120,
    image: "/src/images/hat-1.png",
    rarity: "common",
  },
  {
    id: "bow-1",
    name: "Pink Bow",
    category: "Clothes",
    price: 150,
    image: "/src/images/bow-1.png",
    rarity: "rare",
  },
  {
    id: "scarf-1",
    name: "Cozy Scarf",
    category: "Clothes",
    price: 200,
    image: "/src/images/scarf.png",
    rarity: "rare",
  },
  {
    id: "food-carrot",
    name: "Carrot Stick",
    category: "Food",
    price: 20,
    image: "/src/images/food-carrot.png",
    rarity: "common",
  },
  {
    id: "food-2",
    name: "Berry Bites",
    category: "Food",
    price: 25,
    image: "/src/images/berry.png",
    rarity: "common",
  },
  {
    id: "food-3",
    name: "Nibble Apple",
    category: "Food",
    price: 25,
    image: "/src/images/apple.png",
    rarity: "common",
  },
  {
    id: "food-4",
    name: "Mini Cookie Crunch",
    category: "Food",
    price: 30,
    image: "/src/images/cookie.png",
    rarity: "common",
  },
  {
    id: "food-5",
    name: "Cheddar Cube",
    category: "Food",
    price: 30,
    image: "/src/images/cheese.png",
    rarity: "common",
  },
  {
    id: "food-6",
    name: "Creamy Milk Bottle",
    category: "Food",
    price: 35,
    image: "/src/images/milk.png",
    rarity: "common",
  },
  {
    id: "food-7",
    name: "Lil' Fishy Snack",
    category: "Food",
    price: 40,
    image: "/src/images/fish.png",
    rarity: "common",
  },
  {
    id: "food-8",
    name: "Crispy Cracker Bite",
    category: "Food",
    price: 25,
    image: "/src/images/cracker.png",
    rarity: "common",
  },
  {
    id: "food-9",
    name: "Fruitie Cup",
    category: "Food",
    price: 60,
    image: "/src/images/fruit-cup.png",
    rarity: "rare",
  },
  {
    id: "food-10",
    name: "Cute Sandwi-Wich",
    category: "Food",
    price: 80,
    image: "/src/images/sandwich.png",
    rarity: "rare",
  },
  {
    id: "food-11",
    name: "Warm Belly Soup",
    category: "Food",
    price: 90,
    image: "/src/images/soup.png",
    rarity: "rare",
  },
  {
    id: "food-12",
    name: "Sweet Sprinkle Cupcake",
    category: "Food",
    price: 80,
    image: "/src/images/cupcake.png",
    rarity: "rare",
  },
  {
    id: "food-13",
    name: "Crunchy Chip Bag",
    category: "Food",
    price: 70,
    image: "/src/images/chips.png",
    rarity: "rare",
  },
  {
    id: "food-14",
    name: "Adventure Trail Mix",
    category: "Food",
    price: 90,
    image: "/src/images/trail-mix.png",
    rarity: "rare",
  },
  {
    id: "food-15",
    name: "Cozy Noddle Cup",
    category: "Food",
    price: 110,
    image: "/src/images/ramen.png",
    rarity: "rare",
  },
  {
    id: "food-16",
    name: "Fluffy Pancake Stack",
    category: "Food",
    price: 120,
    image: "/src/images/pancakes.png",
    rarity: "rare",
  },
  {
    id: "food-17",
    name: "Prism Sprinkle Donut",
    category: "Food",
    price: 150,
    image: "/src/images/donut.png",
    rarity: "epic",
  },
  {
    id: "food-18",
    name: "Enchanted Golden Apple",
    category: "Food",
    price: 200,
    image: "/src/images/golden-apple.png",
    rarity: "epic",
  },
  {
    id: "food-19",
    name: "Mystic Moonberry",
    category: "Food",
    price: 180,
    image: "/src/images/magic-berry.png",
    rarity: "epic",
  },
  {
    id: "food-20",
    name: "Royal Sea Feast",
    category: "Food",
    price: 250,
    image: "/src/images/fishes.png",
    rarity: "epic",
  },
  {
    id: "food-21",
    name: "Starlight Crunch Cookie",
    category: "Food",
    price: 160,
    image: "/src/images/star-cookie.png",
    rarity: "epic",
  },
  {
    id: "food-22",
    name: "Dreamy Cosmic Sundae",
    category: "Food",
    price: 170,
    image: "/src/images/sundae.png",
    rarity: "epic",
  },
  {
    id: "food-23",
    name: "Lucky Charm Bento",
    category: "Food",
    price: 260,
    image: "/src/images/bento.png",
    rarity: "epic",
  },
  {
    id: "food-24",
    name: "Molten Magma Cake",
    category: "Food",
    price: 220,
    image: "/src/images/cake.png",
    rarity: "epic",
  },
  {
    id: "toy-1",
    name: "Yarn Ball",
    category: "Accessories",
    price: 100,
    image: "/src/images/yarnball.png",
    rarity: "common",
  },
  {
    id: "bg-cozy_room",
    name: "Cozy Room",
    category: "Backgrounds",
    price: 280,
    image: "/src/images/cozy_room.png",
    rarity: "rare",
  },
  {
    id: "bg-park",
    name: "Park",
    category: "Backgrounds",
    price: 300,
    image: "/src/images/park.png",
    rarity: "epic",
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
            <div className="flex items-center gap-2 bg-bg-card px-8 py-1.5 rounded-full shadow-[0_6px_3px_#c9c5bf]">
              <img
                src="/src/images/Coins.png"
                alt="Coins"
                className="coin-header-icon"
              />
              <span className="text-dark font-semibold text-xl">
                {inventory?.coins || 0}
              </span>
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
                    ? "bg-primary bg-primary shadow-[0_6px_0_#5a86c4] text-white border-primary shadow transition-all hover:scale-110 hover:bg-primary-dark active:translate-y-0.5"
                    : "bg-bg-card bg-primary shadow-[0_6px_0_#c9c5bf] text-dark border-primary-light hover:bg-primary-light/50 shadow transition-all hover:scale-110 hover:bg-primary-dark active:translate-y-0.5")
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
                className="bg-bg-card rounded-xl p-6 shadow-[0_6px_3px_#c9c5bf] flex flex-col items-center transition"
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
                      ? "bg-bg bg-primary shadow-[0_6px_0_#c9c5bf] text-dark border-primary-light hover:bg-primary-light/50 active:translate-y-0.5 shadow transition-all hover:scale-105"
                      : notEnough
                      ? "text-light border border-primary-light cursor-not-allowed"
                      : "bg-primary bg-primary shadow-[0_6px_0_#5a86c4] text-white border-primary shadow transition-all hover:scale-105 active:translate-y-0.5")
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