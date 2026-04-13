"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  category: Category;
};

type ProductsResponse = {
  products: Product[];
  searchMeta?: {
    rawSearch?: string;
    correctedSearch?: string;
    searchTerms?: string[];
  };
};

type ProductCatalogProps = {
  search: string;
  initialSort?: string;
  initialPetType?: string;
  initialProductType?: string;
};

export default function ProductCatalog({
  search,
  initialSort = "newest",
  initialPetType = "",
  initialProductType = "",
}: ProductCatalogProps) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [petType, setPetType] = useState(initialPetType);
  const [productType, setProductType] = useState(initialProductType);
  const [correctedSearch, setCorrectedSearch] = useState("");

  useEffect(() => {
    setSort(initialSort);
    setPetType(initialPetType);
    setProductType(initialProductType);
  }, [initialSort, initialPetType, initialProductType]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        setCorrectedSearch("");

        const params = new URLSearchParams();

        if (search) {
          params.set("search", search);
        }

        if (sort) {
          params.set("sort", sort);
        }

        if (petType) {
          params.set("petType", petType);
        }

        if (productType) {
          params.set("productType", productType);
        }

        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });

        const data: ProductsResponse = await response.json();

        if (!response.ok) {
          setError("Помилка завантаження товарів");
          setProducts([]);
          return;
        }

        setProducts(data.products || []);

        if (
          data.searchMeta?.rawSearch &&
          data.searchMeta?.correctedSearch &&
          data.searchMeta.rawSearch.toLowerCase() !==
            data.searchMeta.correctedSearch.toLowerCase()
        ) {
          setCorrectedSearch(data.searchMeta.correctedSearch);
        }
      } catch {
        setError("Помилка завантаження товарів");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [search, sort, petType, productType]);

  function applyFilters(nextValues?: {
    sort?: string;
    petType?: string;
    productType?: string;
  }) {
    const params = new URLSearchParams();

    const nextSort = nextValues?.sort ?? sort;
    const nextPetType = nextValues?.petType ?? petType;
    const nextProductType = nextValues?.productType ?? productType;

    if (search) {
      params.set("search", search);
    }

    if (nextSort) {
      params.set("sort", nextSort);
    }

    if (nextPetType) {
      params.set("petType", nextPetType);
    }

    if (nextProductType) {
      params.set("productType", nextProductType);
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  }

  function handleSortChange(value: string) {
    setSort(value);
    applyFilters({ sort: value });
  }

  function handlePetTypeChange(value: string) {
    setPetType(value);
    applyFilters({ petType: value });
  }

  function handleProductTypeChange(value: string) {
    setProductType(value);
    applyFilters({ productType: value });
  }

  function resetFilters() {
    setSort("newest");
    setPetType("");
    setProductType("");

    if (search) {
      router.push(`/?search=${encodeURIComponent(search)}`);
      return;
    }

    router.push("/");
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-3xl font-bold">Каталог товарів</h2>

        {search ? (
          <p className="text-sm mt-2">
            Результати пошуку за запитом: <strong>{search}</strong>
          </p>
        ) : (
          <p className="text-sm mt-2">Усі доступні товари</p>
        )}

        {correctedSearch && (
          <p className="text-sm mt-2 text-orange-700">
            Пошук виправлено на: <strong>{correctedSearch}</strong>
          </p>
        )}
      </div>

      <div className="mb-6 flex gap-3 flex-wrap items-center">
        <select
          value={petType}
          onChange={(e) => handlePetTypeChange(e.target.value)}
          className="border rounded-xl px-3 py-2 bg-white"
        >
          <option value="">Усі тварини</option>
          <option value="CAT">Коти</option>
          <option value="DOG">Собаки</option>
        </select>

        <select
          value={productType}
          onChange={(e) => handleProductTypeChange(e.target.value)}
          className="border rounded-xl px-3 py-2 bg-white"
        >
          <option value="">Усі товари</option>
          <option value="FOOD">Корм</option>
          <option value="HARNESS">Шлейки</option>
          <option value="ACCESSORY">Аксесуари</option>
          <option value="TOY">Іграшки</option>
          <option value="HYGIENE">Гігієна</option>
        </select>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border rounded-xl px-3 py-2 bg-white"
        >
          <option value="newest">Спочатку нові</option>
          <option value="oldest">Спочатку старі</option>
          <option value="price_asc">Ціна: від дешевих</option>
          <option value="price_desc">Ціна: від дорогих</option>
          <option value="name_asc">Назва: А-Я</option>
          <option value="name_desc">Назва: Я-А</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
        >
          Скинути
        </button>
      </div>

      {loading && <p>Завантаження товарів...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && products.length === 0 && <p>Товарів не знайдено.</p>}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md border border-yellow-300 p-5"
            >
              <div className="mb-3">
                <p className="text-xs opacity-70">{product.category.name}</p>
                <h3 className="text-xl font-bold mt-1">{product.name}</h3>
              </div>

              {product.description && (
                <p className="text-sm opacity-80 mb-3">{product.description}</p>
              )}

              <div className="space-y-1 text-sm mb-4">
                {product.brand && (
                  <p>
                    <strong>Бренд:</strong> {product.brand}
                  </p>
                )}

                <p>
                  <strong>Тип товару:</strong> {product.productType}
                </p>

                <p>
                  <strong>Тип тварини:</strong> {product.petType}
                </p>

                <p>
                  <strong>Вік:</strong> {product.ageGroup}
                </p>

                {product.foodType && (
                  <p>
                    <strong>Тип корму:</strong> {product.foodType}
                  </p>
                )}

                {product.caloriesPer100g !== null && (
                  <p>
                    <strong>Ккал / 100 г:</strong> {product.caloriesPer100g}
                  </p>
                )}

                {product.feedingMinGPerDay !== null &&
                  product.feedingMaxGPerDay !== null && (
                    <p>
                      <strong>Добова норма:</strong> {product.feedingMinGPerDay}–
                      {product.feedingMaxGPerDay} г
                    </p>
                  )}

                {product.sizeLabel && (
                  <p>
                    <strong>Розмір:</strong> {product.sizeLabel}
                  </p>
                )}

                {product.neckMinCm !== null && product.neckMaxCm !== null && (
                  <p>
                    <strong>Шия:</strong> {product.neckMinCm}–{product.neckMaxCm} см
                  </p>
                )}

                {product.chestMinCm !== null && product.chestMaxCm !== null && (
                  <p>
                    <strong>Груди:</strong> {product.chestMinCm}–{product.chestMaxCm} см
                  </p>
                )}

                {product.recommendedWeightMinKg !== null &&
                  product.recommendedWeightMaxKg !== null && (
                    <p>
                      <strong>Вага тварини:</strong>{" "}
                      {product.recommendedWeightMinKg}–
                      {product.recommendedWeightMaxKg} кг
                    </p>
                  )}

                <p>
                  <strong>Наявність:</strong> {product.stock}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">
                  {product.price} ₴
                </span>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 transition"
                >
                  У кошик
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}