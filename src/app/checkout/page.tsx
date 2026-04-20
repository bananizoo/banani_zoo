"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [comment, setComment] = useState("");

  const [isPickup, setIsPickup] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"COURIER" | "NOVA_POSHTA" | "PICKUP">("COURIER");
  const [paymentType, setPaymentType] = useState<"CASH" | "CARD_ON_DELIVERY" | "ONLINE">("CASH");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [successOrderNumber, setSuccessOrderNumber] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function loadCart() {
      try {
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
        setLoadingCart(false);
      }
    }

    loadCart();
  }, []);

  function handlePickupChange(checked: boolean) {
    setIsPickup(checked);

    if (checked) {
      setDeliveryType("PICKUP");
      setCity("");
      setAddress("");
    } else {
      setDeliveryType("COURIER");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          comment,
          deliveryType,
          paymentType,
          city,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.error || "Не вдалося оформити замовлення");
        return;
      }

      window.dispatchEvent(new Event("cart-updated"));
      setSuccessOrderNumber(data.orderNumber);
      setShowSuccessModal(true);
      setMessage("");
    } catch {
      setMessage("Помилка при оформленні замовлення");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCart) {
    return <p>Завантаження...</p>;
  }

  if (items.length === 0) {
    return (
      <section className="mt-8">
        <h1 className="text-3xl font-bold mb-4">Оформлення замовлення</h1>
        <p>Кошик порожній</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
       {showSuccessModal && (
         <div
           style={{
             position: "fixed",
             inset: 0,
             background: "rgba(0, 0, 0, 0.35)",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             zIndex: 2000,
           }}
         >
           <div
             style={{
               background: "#fff",
               border: "1px solid #ccc",
               padding: "24px",
               width: "90%",
               maxWidth: "420px",
               textAlign: "center",
             }}
           >
             <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
               Дякуємо за замовлення!
             </h2>
       
             <p style={{ marginBottom: "10px" }}>
               Ваше замовлення успішно оформлено.
             </p>
       
             <p style={{ marginBottom: "20px" }}>
               Номер замовлення: <strong>BANANI--{successOrderNumber}</strong>
             </p>
       
             <button
               type="button"
               onClick={() => {
                 setShowSuccessModal(false);
                 router.push("/");
               }}
               style={{
                 cursor: "pointer",
                 padding: "10px 16px",
                 border: "1px solid #ccc",
                 background: "#facc15",
               }}
             >
               На головну
             </button>
           </div>
         </div>
       )}
      <h1 className="text-3xl font-bold mb-6">Оформлення замовлення</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="border p-4 bg-white space-y-4">
          <div>
            <label>Ім’я</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border px-3 py-2"
              required
            />
          </div>

          <div>
            <label>Телефон</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border px-3 py-2"
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPickup}
                onChange={(e) => handlePickupChange(e.target.checked)}
              />
              Самовивіз
            </label>
          </div>

          {!isPickup && (
            <>
              <div>
                <label>Спосіб доставки</label>
                <select
                  value={deliveryType}
                  onChange={(e) =>
                    setDeliveryType(
                      e.target.value as "COURIER" | "NOVA_POSHTA" | "PICKUP"
                    )
                  }
                  className="w-full border px-3 py-2"
                >
                  <option value="COURIER">Кур’єр</option>
                  <option value="NOVA_POSHTA">Нова пошта</option>
                </select>
              </div>

              <div>
                <label>Місто</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border px-3 py-2"
                  required={!isPickup}
                />
              </div>

              <div>
                <label>Адреса / відділення</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border px-3 py-2"
                  required={!isPickup}
                />
              </div>
            </>
          )}

          <div>
            <label>Оплата</label>
            <select
              value={paymentType}
              onChange={(e) =>
                setPaymentType(
                  e.target.value as "CASH" | "CARD_ON_DELIVERY" | "ONLINE"
                )
              }
              className="w-full border px-3 py-2"
            >
              <option value="CASH">Готівкою</option>
              <option value="CARD_ON_DELIVERY">Карткою при отриманні</option>
              <option value="ONLINE">Онлайн-оплата</option>
            </select>
          </div>

          <div>
            <label>Коментар</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border px-3 py-2"
              rows={4}
            />
          </div>

          {message && <p>{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="border px-4 py-2 bg-yellow-300"
          >
            {submitting ? "Оформлення..." : "Підтвердити замовлення"}
          </button>
        </form>

        <div className="border p-4 bg-white">
          <h2 className="text-2xl font-bold mb-4">Ваше замовлення</h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border p-3">
                <p><strong>{item.productName}</strong></p>
                <p>Ціна: {item.price} грн</p>
                <p>Кількість: {item.quantity}</p>
                <p>Сума: {(item.price * item.quantity).toFixed(2)} грн</p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <h3 className="text-xl font-bold">
            Загальна вартість: {totalPrice.toFixed(2)} грн
          </h3>
        </div>
      </div>
    </section>
  );
}