"use client";

import { useEffect, useState } from "react";
import styles from "./calculator.module.css";
import { Heart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  brand: string | null;
  sizeLabel: string | null;
  feedingMinGPerDay: number | null;
  feedingMaxGPerDay: number | null;
  neckMinCm: number | null;
  neckMaxCm: number | null;
  chestMinCm: number | null;
  chestMaxCm: number | null;
};

export default function CalculatorPage() {
  const [foodPetType, setFoodPetType] = useState("CAT");
  const [weightKg, setWeightKg] = useState("");
  const [ageGroup, setAgeGroup] = useState("ADULT");
  const [activityLevel, setActivityLevel] = useState("normal");

  const [foodResult, setFoodResult] = useState<{
    dailyGrams: number;
    products: Product[];
  } | null>(null);

  const [harnessPetType, setHarnessPetType] = useState("DOG");
  const [neckCm, setNeckCm] = useState("");
  const [chestCm, setChestCm] = useState("");
  const [backLengthCm, setBackLengthCm] = useState("");

  const [harnessResult, setHarnessResult] = useState<{
    products: Product[];
  } | null>(null);

  const [message, setMessage] = useState("");

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);

async function loadFavorites() {
  const response = await fetch("/api/favorites", {
    credentials: "include",
  });

  if (!response.ok) {
    setFavoriteProductIds([]);
    return;
  }

  const data = await response.json();

  setFavoriteProductIds(
    data.favorites.map((item: any) => item.productId)
  );
}

async function handleToggleFavorite(productId: string) {
  const isFavorite = favoriteProductIds.includes(productId);

  const response = await fetch("/api/favorites", {
    method: isFavorite ? "DELETE" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    alert("Щоб додати товар в обране, потрібно увійти в акаунт");
    return;
  }

  await loadFavorites();
  window.dispatchEvent(new Event("favorites-updated"));
}

  async function addToCart(productId: string) {
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      alert("Щоб додати товар у кошик, потрібно увійти в акаунт");
      return;
    }

    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("cart-item-added"));
  }

  async function calculateFood(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/calculators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calculatorType: "food",
        petType: foodPetType,
        weightKg,
        ageGroup,
        activityLevel,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Помилка розрахунку");
      return;
    }

    setFoodResult(data);
  }

  async function calculateHarness(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/calculators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calculatorType: "harness",
        petType: harnessPetType,
        neckCm,
        chestCm,
        backLengthCm,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Помилка розрахунку");
      return;
    }

    setHarnessResult(data);
  }

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>
  Калькулятори для тварин
</h1>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Калькулятор корму
          </h2>

          <form onSubmit={calculateFood} className={styles.form}>
            <label>
              Вид тварини
              <select
  value={foodPetType}
  onChange={(e) => setFoodPetType(e.target.value)}
  className={styles.formInput}
>
                <option value="CAT">Кіт</option>
                <option value="DOG">Собака</option>
              </select>
            </label>

            <label>
              Вага, кг
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={styles.formInput}
                min="0.5"
                step="0.1"
              />
            </label>

            <label>
              Вік
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className={styles.formInput}
              >
                <option value="BABY">Малюк</option>
                <option value="ADULT">Дорослий</option>
                <option value="SENIOR">Літній</option>
              </select>
            </label>

            <label>
              Рівень активності
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className={styles.formInput}
              >
                <option value="low">Низький</option>
                <option value="normal">Середній</option>
                <option value="high">Високий</option>
              </select>
            </label>

            <button type="submit" className={styles.button}>
  Розрахувати корм
</button>
          </form>

          {foodResult && (
            <div className={styles.result}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Рекомендована норма: {foodResult.dailyGrams} г/день
              </h3>

              {foodResult.products.length === 0 ? (
                <p>Підходящий корм не знайдено.</p>
              ) : (
                foodResult.products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <button
  type="button"
  onClick={() => handleToggleFavorite(product.id)}
  className={styles.favoriteBtn}
>
  <Heart
    size={28}
    strokeWidth={2}
    color="#e28f00"
    fill={favoriteProductIds.includes(product.id) ? "#e39000" : "none"}
  />
</button>
                    <h4 style={{ fontWeight: "bold" }}>{product.name}</h4>
                    {product.description && <p>{product.description}</p>}
                    <p>Бренд: {product.brand || "—"}</p>
                    <p>Ціна: {product.price} грн</p>
                    <p>Наявність: {product.stock}</p>

                    <button
  type="button"
  onClick={() => addToCart(product.id)}
  className={styles.cartButton}
>
  У кошик
</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Калькулятор шлейки
          </h2>

          <form onSubmit={calculateHarness} className={styles.form}>
            <label>
              Вид тварини
              <select
                value={harnessPetType}
                onChange={(e) => setHarnessPetType(e.target.value)}
                className={styles.formInput}
              >
                <option value="CAT">Кіт</option>
                <option value="DOG">Собака</option>
              </select>
            </label>

            <label>
              Обхват шиї, см
              <input
                type="number"
                value={neckCm}
                onChange={(e) => setNeckCm(e.target.value)}
                className={styles.formInput}
                min="1"
                step="0.5"
              />
            </label>

            <label>
              Обхват грудей, см
              <input
                type="number"
                value={chestCm}
                onChange={(e) => setChestCm(e.target.value)}
                className={styles.formInput}
                min="1"
                step="0.5"
              />
            </label>

            <label>
              Довжина спини, см
              <input
                type="number"
                value={backLengthCm}
                onChange={(e) => setBackLengthCm(e.target.value)}
                className={styles.formInput}
                min="1"
                step="0.5"
              />
            </label>

            <button type="submit" className={styles.button}>
  Підібрати шлейку
</button>
          </form>

          <div className={styles.result}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Таблиця розмірів
            </h3>

            <table className={styles.sizeTable}>
  <thead>
    <tr>
      <th>Розмір</th>
      <th>Шия</th>
      <th>Груди</th>
      <th>Спина</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>XS</td>
      <td>15–25 см</td>
      <td>25–35 см</td>
      <td>20–25 см</td>
    </tr>
    <tr>
      <td>S</td>
      <td>20–30 см</td>
      <td>35–45 см</td>
      <td>25–30 см</td>
    </tr>
    <tr>
      <td>M</td>
      <td>30–45 см</td>
      <td>45–65 см</td>
      <td>30–40 см</td>
    </tr>
    <tr>
      <td>L</td>
      <td>40–60 см</td>
      <td>60–85 см</td>
      <td>40–55 см</td>
    </tr>
  </tbody>
</table>
          </div>

          {harnessResult && (
            <div className={styles.result}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Рекомендовані шлейки
              </h3>

              {harnessResult.products.length === 0 ? (
                <p>Підходящу шлейку не знайдено.</p>
              ) : (
                harnessResult.products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <button
  type="button"
  onClick={() => handleToggleFavorite(product.id)}
  className={styles.favoriteBtn}
>
  <Heart
    size={28}
    strokeWidth={2}
    color="#e28f00"
    fill={favoriteProductIds.includes(product.id) ? "#e39000" : "none"}
  />
</button>
                    <h4 style={{ fontWeight: "bold" }}>{product.name}</h4>
                    <p>Розмір: {product.sizeLabel || "—"}</p>
                    <p>
                      Шия: {product.neckMinCm}–{product.neckMaxCm} см
                    </p>
                    <p>
                      Груди: {product.chestMinCm}–{product.chestMaxCm} см
                    </p>
                    <p>Ціна: {product.price} грн</p>
                    <p>Наявність: {product.stock}</p>

                    <button
  type="button"
  onClick={() => addToCart(product.id)}
  className={styles.cartButton}
>
  У кошик
</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}