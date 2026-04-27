"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  brand: string | null;
  productType: string;
  petType: string;
  ageGroup: string;
  foodType: string | null;
  caloriesPer100g: number | null;
  feedingMinGPerDay: number | null;
  feedingMaxGPerDay: number | null;
  recommendedWeightMinKg: number | null;
  recommendedWeightMaxKg: number | null;
  sizeLabel: string | null;
  neckMinCm: number | null;
  neckMaxCm: number | null;
  chestMinCm: number | null;
  chestMaxCm: number | null;
  category: {
    name: string;
  };
};

type FavoriteItem = {
  id: string;
  productId: string;
  product: Product;
};

export default function ComparePage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [firstProductId, setFirstProductId] = useState("");
  const [secondProductId, setSecondProductId] = useState("");

  async function loadFavorites() {
    try {
      const response = await fetch("/api/favorites", {
        credentials: "include",
      });

      if (!response.ok) {
        setMessage("Для порівняння товарів потрібно увійти в акаунт");
        setFavorites([]);
        return;
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch {
      setMessage("Помилка завантаження товарів для порівняння");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  const firstProduct = favorites.find(
    (item) => item.product.id === firstProductId
  )?.product;

  const secondProduct = favorites.find(
    (item) => item.product.id === secondProductId
  )?.product;

  function getBetterPrice() {
    if (!firstProduct || !secondProduct) return "";
    if (firstProduct.price < secondProduct.price) return firstProduct.name;
    if (secondProduct.price < firstProduct.price) return secondProduct.name;
    return "Ціна однакова";
  }

  function getBetterStock() {
    if (!firstProduct || !secondProduct) return "";
    if (firstProduct.stock > secondProduct.stock) return firstProduct.name;
    if (secondProduct.stock > firstProduct.stock) return secondProduct.name;
    return "Наявність однакова";
  }

  function renderValue(value: string | number | null) {
    if (value === null || value === "") {
      return "—";
    }

    return value;
  }

  if (loading) {
    return <p>Завантаження...</p>;
  }

  if (message) {
    return (
      <section style={{ marginTop: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
          Порівняння товарів
        </h1>
        <p>{message}</p>
      </section>
    );
  }

  if (favorites.length < 2) {
    return (
      <section style={{ marginTop: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
          Порівняння товарів
        </h1>

        <p>
          Для порівняння товарів додайте більше товарів до обраного.
        </p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        Порівняння товарів
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            border: "2px dashed #999",
            padding: "20px",
            background: "#fff",
            minHeight: "180px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
            Товар 1
          </h2>

          <select
            value={firstProductId}
            onChange={(e) => setFirstProductId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "16px",
            }}
          >
            <option value="">Додати товар</option>

            {favorites.map((item) => (
              <option
                key={item.id}
                value={item.product.id}
                disabled={item.product.id === secondProductId}
              >
                {item.product.name}
              </option>
            ))}
          </select>

          {firstProduct && (
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {firstProduct.name}
              </h3>
              <p>{firstProduct.description}</p>
              <p>
                <strong>Ціна:</strong> {firstProduct.price} грн
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            border: "2px dashed #999",
            padding: "20px",
            background: "#fff",
            minHeight: "180px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
            Товар 2
          </h2>

          <select
            value={secondProductId}
            onChange={(e) => setSecondProductId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "16px",
            }}
          >
            <option value="">Додати товар</option>

            {favorites.map((item) => (
              <option
                key={item.id}
                value={item.product.id}
                disabled={item.product.id === firstProductId}
              >
                {item.product.name}
              </option>
            ))}
          </select>

          {secondProduct && (
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {secondProduct.name}
              </h3>
              <p>{secondProduct.description}</p>
              <p>
                <strong>Ціна:</strong> {secondProduct.price} грн
              </p>
            </div>
          )}
        </div>
      </div>

      {firstProduct && secondProduct && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <h2 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "16px" }}>
            Результат порівняння
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  Характеристика
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.name}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Категорія</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.category.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.category.name}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Бренд</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {renderValue(firstProduct.brand)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {renderValue(secondProduct.brand)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Тип товару</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.productType}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.productType}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Тип тварини</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.petType}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.petType}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Вік</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.ageGroup}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.ageGroup}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Ціна</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.price} грн
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.price} грн
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  Наявність
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.stock}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.stock}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Розмір</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {renderValue(firstProduct.sizeLabel)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {renderValue(secondProduct.sizeLabel)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Шия</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.neckMinCm !== null && firstProduct.neckMaxCm !== null
                    ? `${firstProduct.neckMinCm}–${firstProduct.neckMaxCm} см`
                    : "—"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.neckMinCm !== null && secondProduct.neckMaxCm !== null
                    ? `${secondProduct.neckMinCm}–${secondProduct.neckMaxCm} см`
                    : "—"}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Груди</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.chestMinCm !== null && firstProduct.chestMaxCm !== null
                    ? `${firstProduct.chestMinCm}–${firstProduct.chestMaxCm} см`
                    : "—"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.chestMinCm !== null && secondProduct.chestMaxCm !== null
                    ? `${secondProduct.chestMinCm}–${secondProduct.chestMaxCm} см`
                    : "—"}
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  Вага тварини
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {firstProduct.recommendedWeightMinKg !== null &&
                  firstProduct.recommendedWeightMaxKg !== null
                    ? `${firstProduct.recommendedWeightMinKg}–${firstProduct.recommendedWeightMaxKg} кг`
                    : "—"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {secondProduct.recommendedWeightMinKg !== null &&
                  secondProduct.recommendedWeightMaxKg !== null
                    ? `${secondProduct.recommendedWeightMinKg}–${secondProduct.recommendedWeightMaxKg} кг`
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              background: "#fffdf2",
            }}
          >
            <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>
              Висновок
            </h3>

            <p>
              За ціною вигідніший товар: <strong>{getBetterPrice()}</strong>.
            </p>

            <p>
              За кількістю на складі кращий варіант:{" "}
              <strong>{getBetterStock()}</strong>.
            </p>

            {firstProduct.productType === secondProduct.productType ? (
              <p>Товари належать до одного типу, тому їх зручно порівнювати напряму.</p>
            ) : (
              <p>
                Товари належать до різних типів, тому частина характеристик може
                відрізнятися.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}