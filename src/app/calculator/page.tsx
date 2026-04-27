"use client";

import { useState } from "react";

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
    <section style={{ marginTop: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        Калькулятори для тварин
      </h1>

      {message && <p>{message}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        <div style={{ background: "white", border: "1px solid #ddd", padding: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Калькулятор корму
          </h2>

          <form onSubmit={calculateFood} style={{ display: "grid", gap: "12px" }}>
            <label>
              Вид тварини
              <select
                value={foodPetType}
                onChange={(e) => setFoodPetType(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                min="0.5"
                step="0.1"
              />
            </label>

            <label>
              Вік
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
              >
                <option value="low">Низький</option>
                <option value="normal">Середній</option>
                <option value="high">Високий</option>
              </select>
            </label>

            <button
              type="submit"
              style={{
                cursor: "pointer",
                padding: "10px",
                border: "1px solid #ccc",
                background: "#facc15",
              }}
            >
              Розрахувати корм
            </button>
          </form>

          {foodResult && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Рекомендована норма: {foodResult.dailyGrams} г/день
              </h3>

              {foodResult.products.length === 0 ? (
                <p>Підходящий корм не знайдено.</p>
              ) : (
                foodResult.products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <h4 style={{ fontWeight: "bold" }}>{product.name}</h4>
                    {product.description && <p>{product.description}</p>}
                    <p>Бренд: {product.brand || "—"}</p>
                    <p>Ціна: {product.price} грн</p>
                    <p>Наявність: {product.stock}</p>

                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      style={{
                        cursor: "pointer",
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        background: "#facc15",
                      }}
                    >
                      У кошик
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #ddd", padding: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Калькулятор шлейки
          </h2>

          <form onSubmit={calculateHarness} style={{ display: "grid", gap: "12px" }}>
            <label>
              Вид тварини
              <select
                value={harnessPetType}
                onChange={(e) => setHarnessPetType(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                min="1"
                step="0.5"
              />
            </label>

            <button
              type="submit"
              style={{
                cursor: "pointer",
                padding: "10px",
                border: "1px solid #ccc",
                background: "#facc15",
              }}
            >
              Підібрати шлейку
            </button>
          </form>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              Таблиця розмірів
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>XS</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Шия 15–25 см</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Груди 25–35 см</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>S</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Шия 20–30 см</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Груди 35–45 см</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>M</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Шия 30–45 см</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Груди 45–65 см</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>L</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Шия 40–60 см</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Груди 60–85 см</td>
                </tr>
              </tbody>
            </table>
          </div>

          {harnessResult && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Рекомендовані шлейки
              </h3>

              {harnessResult.products.length === 0 ? (
                <p>Підходящу шлейку не знайдено.</p>
              ) : (
                harnessResult.products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      marginTop: "12px",
                    }}
                  >
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
                      style={{
                        cursor: "pointer",
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        background: "#facc15",
                      }}
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