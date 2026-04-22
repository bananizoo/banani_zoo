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

  async function loadCart() {
    try {
      setLoading(true);

      const response = await fetch("/api/cart", {
        credentials: "include",
      });

      if (!response.ok) {
        setItems([]);
        setTotalPrice(0);
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

  async function increaseQuantity(productId: string, currentQuantity: number) {
    await fetch("/api/cart/item", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity: currentQuantity + 1 }),
    });

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
    await fetch("/api/cart/item", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity }),
    });

    await loadCart();
  }

  async function removeItem(productId: string) {
    await fetch("/api/cart/item", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    setConfirmProductId(null);
    await loadCart();
  }

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* 🔔 Повідомлення */}
      {showAddedMessage && (
        <div className="fixed right-6 bottom-24 bg-yellow-100 border border-yellow-300 px-4 py-3 rounded-xl shadow-lg z-[1002] animate-bounce">
          🛒 Товар додано до кошика
        </div>
      )}

      {/* 🛒 КНОПКА */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-6 bottom-6 w-24 h-24 rounded-full bg-yellow-200 hover:bg-yellow-400 shadow-xl flex items-center justify-center text-2xl z-[1000] transition transform hover:scale-110"
      >
        🛒

        {totalItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow">
            {totalItemsCount}
          </span>
        )}
      </button>

      {/* 📦 DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[360px] bg-yellow-50 border-l-2 border-yellow-300 shadow-2xl z-[1001] transition-transform duration-300 ${
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
                    className="bg-white rounded-2xl border border-yellow-300 p-4 shadow-sm"
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
                        className="px-3 py-1 rounded-lg bg-yellow-200 hover:bg-yellow-300"
                      >
                        −
                      </button>

                      <button
                        onClick={() =>
                          increaseQuantity(item.productId, item.quantity)
                        }
                        className="px-3 py-1 rounded-lg bg-yellow-200 hover:bg-yellow-300"
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
                      <div className="mt-3 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
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
            <div className="pt-4 border-t border-yellow-300">
              <h3 className="text-lg font-bold mb-3">
                Разом: {totalPrice.toFixed(2)} грн
              </h3>

              <button
                onClick={() => {
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