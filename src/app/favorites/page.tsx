"use client";

import { useEffect, useState } from "react";

type FavoriteItem = {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    brand: string | null;
    productType: string;
    petType: string;
    ageGroup: string;
    category: {
      name: string;
    };
  };
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadFavorites() {
    try {
      const response = await fetch("/api/favorites", {
        credentials: "include",
      });

      if (!response.ok) {
        setMessage("Щоб переглянути обране, потрібно увійти в акаунт");
        setFavorites([]);
        return;
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch {
      setMessage("Помилка завантаження обраного");
    } finally {
      setLoading(false);
    }
  }

  async function removeFromFavorites(productId: string) {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    window.dispatchEvent(new Event("favorites-updated"));
    await loadFavorites();
  }

  async function handleAddToCart(productId: string) {
  try {
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error || "Не вдалося додати товар у кошик");
      return;
    }

    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("cart-item-added"));
  } catch {
    alert("Помилка при додаванні товару у кошик");
  }
}

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return <p>Завантаження...</p>;
  }

  return (
    <section style={{ marginTop: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        Обране
      </h1>

      {message && <p>{message}</p>}

      {!message && favorites.length === 0 && (
        <p>Список обраного порожній</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {favorites.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              border: "1px solid #facc15",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <button
              type="button"
              onClick={() => removeFromFavorites(item.productId)}
              style={{
                float: "right",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                fontSize: "24px",
              }}
            >
              ❤️
            </button>

            <p style={{ fontSize: "12px", opacity: 0.7 }}>
              {item.product.category.name}
            </p>

            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              {item.product.name}
            </h3>

            {item.product.description && <p>{item.product.description}</p>}

            <p><b>Бренд:</b> {item.product.brand}</p>
            <p><b>Тип товару:</b> {item.product.productType}</p>
            <p><b>Тип тварини:</b> {item.product.petType}</p>
            <p><b>Наявність:</b> {item.product.stock}</p>

            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ea580c" }}>
              {item.product.price} ₴
            </p>
            <button
              type="button"
              onClick={() => handleAddToCart(item.product.id)}
              style={{
                cursor: "pointer",
                padding: "8px 14px",
                border: "1px solid #ccc",
                background: "#facc15",
                marginTop: "10px",
              }}
            >
              У кошик
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}