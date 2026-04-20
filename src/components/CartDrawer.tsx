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
      window.addEventListener("cart-item-added", handleCartItemAdded);
    };
  }, []);

  async function increaseQuantity(productId: string, currentQuantity: number) {
    await fetch("/api/cart/item", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productId,
        quantity: currentQuantity + 1,
      }),
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
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    await loadCart();
  }

  async function removeItem(productId: string) {
    await fetch("/api/cart/item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productId,
      }),
    });

    setConfirmProductId(null);
    await loadCart();
  }

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {showAddedMessage && (
        <div
           style={{
             position: "fixed",
             right: "20px",
             bottom: "95px",
             background: "#fff",
             border: "1px solid #ccc",
             padding: "12px 16px",
             zIndex: 1002,
             boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
           }}
         >
           Товар додано до кошика

        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "64px",
          height: "64px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        🛒
        {totalItemsCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              minWidth: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "#facc15",
              border: "1px solid #999",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            {totalItemsCount}
          </span>
        )}
      </button>

      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-30%",
          width: "30%",
          minWidth: "320px",
          height: "100vh",
          background: "#fff",
          borderLeft: "1px solid #ddd",
          transition: "right 0.3s ease",
          zIndex: 1001,
          padding: "20px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Кошик</h2>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p>Завантаження...</p>
        ) : items.length === 0 ? (
          <p>Кошик порожній</p>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  marginBottom: "12px",
                }}
              >
                <p>
                  <strong>{item.productName}</strong>
                </p>

                <p>Ціна: {item.price} грн</p>
                <p>Кількість: {item.quantity}</p>
                <p>Сума: {(item.price * item.quantity).toFixed(2)} грн</p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.productId, item.quantity)}
                    style={{ cursor: "pointer" }}
                  >
                    -
                  </button>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.productId, item.quantity)}
                    style={{ cursor: "pointer" }}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmProductId(item.productId)}
                    style={{
                      marginLeft: "auto",
                      cursor: "pointer",
                    }}
                  >
                    Видалити
                  </button>
                </div>

                {confirmProductId === item.productId && (
                  <div
                    style={{
                      marginTop: "12px",
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    <p>Дійсно хочете видалити з кошика?</p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        style={{ cursor: "pointer" }}
                      >
                        Так
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmProductId(null)}
                        style={{ cursor: "pointer" }}
                      >
                        Ні
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <hr style={{ margin: "16px 0" }} />

            <h3>Загальна вартість: {totalPrice.toFixed(2)} грн</h3>
            <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/checkout";
            }}
            style={{
              marginTop: "12px",
              cursor: "pointer",
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              background: "#facc15",
            }}
          >
            Оформити замовлення
          </button>
          </>
        )}
      </div>
    </>
  );
}