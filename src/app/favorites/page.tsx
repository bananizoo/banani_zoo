"use client";

import { useEffect, useState } from "react";
import styles from "./favorites.module.css";
import { Heart } from "lucide-react";

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
    <section className={styles.wrapper}>
      <h1 className={styles.title}>
  Обране
</h1>

      {message && <p>{message}</p>}

      {!message && favorites.length === 0 && (
        <p>Список обраного порожній</p>
      )}

      <div className={styles.grid}>
        {favorites.map((item) => (
          <div key={item.id} className={styles.card}>
<button
  type="button"
  onClick={() => removeFromFavorites(item.productId)}
  className={styles.favoriteBtn}
>
  <Heart
    size={28}
    strokeWidth={2}
    color="#e28f00"
    fill="#e39000"
  />
</button>

<div className={styles.badges}>
  <span className={`${styles.badge} ${styles.badgeType}`}>
    {item.product.category.name}
  </span>

  <span className={`${styles.badge} ${styles.badgePet}`}>
    {item.product.petType === "DOG" && "Собака"}
    {item.product.petType === "CAT" && "Кіт"}
  </span>
</div>

            <h3 className={styles.name}>
  {item.product.name}
</h3>

            {item.product.description && (
  <p className={styles.desc}>{item.product.description}</p>
)}

            <p><b>Бренд:</b> {item.product.brand}</p>
            <p><b>Тип товару:</b> {item.product.productType}</p>
            <p><b>Тип тварини:</b> {item.product.petType}</p>
            <p><b>Наявність:</b> {item.product.stock}</p>

            <p className={styles.price}>
  {item.product.price} ₴
</p>
            <button
  type="button"
  onClick={() => handleAddToCart(item.product.id)}
  className={styles.button}
>
  У кошик
</button>
          </div>
        ))}
      </div>
    </section>
  );
}