"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./productCatalog.module.css";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  brand: string | null;
  imageUrl: string | null;
  productType: string;
  petType: string;
  ageGroup: string;
  sizeLabel: string | null;
  neckMinCm: number | null;
  neckMaxCm: number | null;
  chestMinCm: number | null;
  chestMaxCm: number | null;
  recommendedWeightMinKg: number | null;
  recommendedWeightMaxKg: number | null;
  category: Category;
};

type ProductsResponse = {
  products: Product[];
  pagination?: {
    page: number;
    totalPages: number;
  };
};

export default function ProductCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ беремо search прямо з URL (ФІКС)
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [petType, setPetType] = useState(searchParams.get("petType") || "");
  const [productType, setProductType] = useState(searchParams.get("productType") || "");

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);

  // 🔄 завантаження товарів
  useEffect(() => {
    loadProducts(1, true);
  }, [search, sort, petType, productType]);

  async function loadProducts(pageToLoad: number, reset = false) {
    const params = new URLSearchParams();

    params.set("search", search); // ✅ FIX
    params.set("sort", sort);
    params.set("page", String(pageToLoad));

    if (petType) params.set("petType", petType);
    if (productType) params.set("productType", productType);

    const res = await fetch(`/api/products?${params.toString()}`, {
      cache: "no-store",
    });

    const data: ProductsResponse = await res.json();

    if (reset) {
      setProducts(data.products || []);
    } else {
      setProducts((prev) => [...prev, ...(data.products || [])]);
    }

    setPage(pageToLoad);
    setHasMore(pageToLoad < (data.pagination?.totalPages || 1));
  }

  // 🔁 оновлення URL
  function applyFilters(next: any) {
    const params = new URLSearchParams();

    const nextSort = next?.sort ?? sort;
    const nextPet = next?.petType ?? petType;
    const nextType = next?.productType ?? productType;

    params.set("search", search); // ✅ FIX (не губиться)

    if (nextSort) params.set("sort", nextSort);
    if (nextPet) params.set("petType", nextPet);
    if (nextType) params.set("productType", nextType);

    router.push(`/?${params.toString()}`);
  }

  function resetFilters() {
    router.push("/");
  }

async function handleAddToCart(product: Product) {
  const response = await fetch("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId: product.id }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    // ❗ НЕ авторизований → додаємо в localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item: any) => item.productId === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  window.dispatchEvent(new Event("cart-item-added"));
}

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

useEffect(() => {
  loadFavorites();
}, []);

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

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Каталог товарів</h2>

      <div className={styles.filters}>
        <select
          value={petType}
          onChange={(e) => {
            setPetType(e.target.value);
            applyFilters({ petType: e.target.value });
          }}
        >
          <option value="">Усі тварини</option>
          <option value="DOG">Собаки</option>
          <option value="CAT">Коти</option>
        </select>

        <select
          value={productType}
          onChange={(e) => {
            setProductType(e.target.value);
            applyFilters({ productType: e.target.value });
          }}
        >
          <option value="">Усі товари</option>
          <option value="FOOD">Корм</option>
          <option value="HARNESS">Шлейки</option>
          <option value="TOY">Іграшки</option>
          <option value="ACCESSORY">Аксесуари</option> {/* ✅ FIX */}
          <option value="HYGIENE">Гігієна</option> {/* ✅ FIX */}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters({ sort: e.target.value });
          }}
        >
          <option value="newest">Нові</option>
          <option value="price_asc">Дешеві</option>
          <option value="price_desc">Дорогі</option>
        </select>

        <button onClick={resetFilters}>Скинути</button>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <button
              type="button"
              onClick={() => handleToggleFavorite(product.id)}
              style={{
                float: "right",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                fontSize: "24px",
              }}
            >
              {favoriteProductIds.includes(product.id) ? "❤️" : "🤍"}
            </button>
            
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeType}`}>
                {product.productType === "HARNESS" && "Шлейка"}
                {product.productType === "FOOD" && "Корм"}
                {product.productType === "TOY" && "Іграшка"}
                {product.productType === "ACCESSORY" && "Аксесуар"}
                {product.productType === "HYGIENE" && "Гігієна"}
              </span>

              <span className={`${styles.badge} ${styles.badgePet}`}>
                {product.petType === "DOG" && "Собака"}
                {product.petType === "CAT" && "Кіт"}
              </span>
            </div>

            <h3 className={styles.name}>{product.name}</h3>

            {product.description && (
              <p className={styles.desc}>{product.description}</p>
            )}

            <div className={styles.info}>
              {product.brand && <p><b>Бренд:</b> {product.brand}</p>}
              <p><b>Тип товару:</b> {product.productType}</p>
              <p><b>Тип тварини:</b> {product.petType}</p>
              <p><b>Вік:</b> {product.ageGroup}</p>

              {product.sizeLabel && <p><b>Розмір:</b> {product.sizeLabel}</p>}
              {product.neckMinCm && product.neckMaxCm && (
                <p><b>Шия:</b> {product.neckMinCm}-{product.neckMaxCm} см</p>
              )}
              {product.chestMinCm && product.chestMaxCm && (
                <p><b>Груди:</b> {product.chestMinCm}-{product.chestMaxCm} см</p>
              )}
              {product.recommendedWeightMinKg && product.recommendedWeightMaxKg && (
                <p>
                  <b>Вага:</b> {product.recommendedWeightMinKg}-
                  {product.recommendedWeightMaxKg} кг
                </p>
              )}

              <p><b>Наявність:</b> {product.stock}</p>
            </div>

            <div className={styles.bottom}>
              <span className={styles.price}>{product.price} ₴</span>
              <button onClick={() => handleAddToCart(product)}>
                У кошик
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ КНОПКА ПАГІНАЦІЇ */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => loadProducts(page + 1)}
            className={styles.loadMore}
          >
            Показати ще
          </button>
        </div>
      )}
    </section>
  );
}