"use client";

import { useEffect, useState } from "react";

type CartItemType = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

type CartResponse = {
  cart: {
    id: string;
    items: CartItemType[];
  };
  totalPrice: number;
};

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const [confirmProductId, setConfirmProductId] = useState<string | null>(null);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

 async function loadCart() {
  try {
    setLoading(true);

    const response = await fetch("/api/cart", {
      credentials: "include",
    });

    if (!response.ok) {
      // ❗ НЕ авторизований → беремо з localStorage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      setItems(localCart);

      const total = localCart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      setTotalPrice(total);
      return;
    }

    const data: CartResponse = await response.json();
    setItems(data.cart.items);
    setTotalPrice(data.totalPrice);

  } catch {
    setItems([]);
    setTotalPrice(0);
  } finally {
    setLoading(false);
  }
}

async function syncLocalCartToServer() {
  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!localCart.length) return;

  for (const item of localCart) {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productId: item.productId,
        quantity: item.quantity,
      }),
    });
  }

  // 🧹 очищаємо localStorage після переносу
  localStorage.removeItem("cart");
}

  useEffect(() => {
    loadCart();

    function handleCartUpdated() {
      loadCart();
    }

    function handleCartItemAdded() {
      loadCart();
      setShowAddedMessage(true);

      setTimeout(() => {
        setShowAddedMessage(false);
      }, 2500);
    }

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("cart-item-added", handleCartItemAdded);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("cart-item-added", handleCartItemAdded);
    };
  }, []);

    function updateLocalCart(productId: string, quantity: number) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const updated = cart.map((item: any) =>
    item.productId === productId
      ? { ...item, quantity }
      : item
  );

  localStorage.setItem("cart", JSON.stringify(updated));
}

function removeLocalItem(productId: string) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const updated = cart.filter((item: any) => item.productId !== productId);

  localStorage.setItem("cart", JSON.stringify(updated));
}

async function increaseQuantity(productId: string, currentQuantity: number) {
  const response = await fetch("/api/cart/item", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity: currentQuantity + 1 }),
  });

  if (!response.ok) {
    updateLocalCart(productId, currentQuantity + 1);
  }

  await loadCart();
}

function decreaseQuantity(productId: string, currentQuantity: number) {
  if (currentQuantity === 1) {
    setConfirmProductId(productId);
    return;
  }

  updateQuantity(productId, currentQuantity - 1);
}

async function updateQuantity(productId: string, quantity: number) {
  const response = await fetch("/api/cart/item", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    updateLocalCart(productId, quantity);
  }

  await loadCart();
}

async function removeItem(productId: string) {
  const response = await fetch("/api/cart/item", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    removeLocalItem(productId);
  }

  setConfirmProductId(null);
  await loadCart();
}

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* 🔔 Повідомлення */}
      {showAddedMessage && (
        <div className="fixed right-6 bottom-35 bg-white/90 backdrop-blur border border-yellow-200 px-5 py-3 rounded-2xl shadow-lg z-[1002] transition-all duration-300">
          🛒 Товар додано до кошика
        </div>
      )}

      {showAuthMessage && (
  <div className="fixed right-6 bottom-35 bg-white/90 backdrop-blur border border-red-200 px-5 py-3 rounded-2xl shadow-lg z-[1002] duration-300">
    🔒 Увійдіть в акаунт, щоб оформити замовлення
  </div>
)}

      {/* 🛒 КНОПКА */}
<button
  onClick={() => setIsOpen(true)}
  className="fixed right-6 bottom-6 w-24 h-24 rounded-full bg-yellow-200 hover:bg-yellow-400 shadow-xl flex items-center justify-center text-2xl z-[1000] transition transform hover:scale-110"
>
  🛒

        {totalItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow">
            {totalItemsCount}
          </span>
        )}
      </button>

      {/* 🔲 OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[1000]"
        />
      )}

      {/* 📦 DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[360px] bg-gradient-to-b from-[#fffdf7] to-[#fff3d6] border-l border-yellow-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[1001] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Кошик 🛒</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <p>Завантаження....</p>
            ) : items.length === 0 ? (
              <p className="text-gray-500">Кошик порожній</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-yellow-200 p-4 shadow-sm"
                  >
                    <p className="font-semibold">{item.productName}</p>

                    <p className="text-sm text-gray-600">
                      {item.price} грн × {item.quantity}
                    </p>

                    <p className="font-bold text-orange-500 mt-1">
                      {(item.price * item.quantity).toFixed(2)} грн
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.productId, item.quantity)
                        }
                        className="px-3 py-1 rounded-lg bg-yellow-100 hover:bg-yellow-200"
                      >
                        −
                      </button>

                      <button
                        onClick={() =>
                          increaseQuantity(item.productId, item.quantity)
                        }
                        className="px-3 py-1 rounded-lg bg-yellow-100 hover:bg-yellow-200"
                      >
                        +
                      </button>

                      <button
                        onClick={() => setConfirmProductId(item.productId)}
                        className="ml-auto text-sm text-red-500 hover:underline"
                      >
                        Видалити
                      </button>
                    </div>

                    {confirmProductId === item.productId && (
                      <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-sm">
                          Видалити товар з кошика?
                        </p>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg"
                          >
                            Так
                          </button>

                          <button
                            onClick={() => setConfirmProductId(null)}
                            className="px-3 py-1 bg-gray-200 rounded-lg"
                          >
                            Ні
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-yellow-200">
              <h3 className="text-lg font-bold mb-3">
                Разом: {totalPrice.toFixed(2)} грн
              </h3>

<button
  onClick={async () => {
    const response = await fetch("/api/cart", {
      credentials: "include",
    });

    if (!response.ok) {
      setShowAuthMessage(true);

      setTimeout(() => {
        setShowAuthMessage(false);
      }, 2500);

      return;
    }

      // 🔥 ОЦЕ ДОДАЙ
  await syncLocalCartToServer();

    setIsOpen(false);
    window.location.href = "/checkout";
  }}
  className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-3 rounded-xl shadow"
>
  Оформити замовлення
</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}