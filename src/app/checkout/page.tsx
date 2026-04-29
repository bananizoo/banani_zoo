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

type DeliveryType = "COURIER" | "NOVA_POSHTA" | "PICKUP";
type PaymentType = "CASH" | "CARD_ON_DELIVERY" | "ONLINE";

type FormErrors = {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  city?: string;
  address?: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+380");
  const [customerEmail, setCustomerEmail] = useState("");
  const [comment, setComment] = useState("");

  const [isPickup, setIsPickup] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("COURIER");
  const [paymentType, setPaymentType] = useState<PaymentType>("CASH");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  const [successOrderNumber, setSuccessOrderNumber] = useState<number | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function loadCart() {
      try {
        const response = await fetch("/api/cart", {
          credentials: "include",
        });

        if (!response.ok) {
          alert("Будь ласка, увійдіть в акаунт для оформлення замовлення!");
          router.push("/login");
          return;
        }

        const data: CartResponse = await response.json();
        setItems(data.cart.items);
        setTotalPrice(data.totalPrice);
      } finally {
        setLoadingCart(false);
      }
    }

    loadCart();
  }, [router]);

  function getFieldError(name: keyof FormErrors, value: string) {
    if (name === "customerName" && value.trim().length < 2) {
      return "Мінімум 2 символи";
    }

    if (name === "customerPhone" && !/^\+380\d{9}$/.test(value)) {
      return "Формат: +380XXXXXXXXX";
    }

    if (
      name === "customerEmail" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return "Невірний email";
    }

    if (name === "city" && !isPickup && !value.trim()) {
      return "Вкажіть місто";
    }

    if (name === "address" && !isPickup && !value.trim()) {
      return "Вкажіть адресу";
    }

    return "";
  }

  function validateField(name: keyof FormErrors, value: string) {
    const error = getFieldError(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  }

  function validateForm() {
    const nextErrors: FormErrors = {
      customerName: getFieldError("customerName", customerName),
      customerPhone: getFieldError("customerPhone", customerPhone),
      customerEmail: getFieldError("customerEmail", customerEmail),
      city: getFieldError("city", city),
      address: getFieldError("address", address),
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  }

  function handlePhoneChange(value: string) {
    let cleaned = value.replace(/\D/g, "");

    if (!cleaned.startsWith("380")) {
      cleaned = "380" + cleaned.replace(/^380/, "");
    }

    cleaned = cleaned.slice(0, 12);

    const formattedPhone = `+${cleaned}`;
    setCustomerPhone(formattedPhone);
    validateField("customerPhone", formattedPhone);
  }

  function fetchCities(query: string) {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    setCitySuggestions(
      ["Київ", "Львів", "Одеса", "Дніпро", "Харків"].filter((currentCity) =>
        currentCity.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  function handlePickupChange(checked: boolean) {
    setIsPickup(checked);

    if (checked) {
      setDeliveryType("PICKUP");
      setCity("");
      setAddress("");
      setCitySuggestions([]);
      setErrors((prev) => ({
        ...prev,
        city: "",
        address: "",
      }));
    } else {
      setDeliveryType("COURIER");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      setMessage("Виправте помилки");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setMessage(data?.error || "Помилка");
        return;
      }

      window.dispatchEvent(new Event("cart-updated"));
      setSuccessOrderNumber(data.orderNumber);
      setShowSuccessModal(true);
    } catch {
      setMessage("Помилка при оформленні");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCart) {
    return <p className="mt-8 text-lg">Завантаження...</p>;
  }

  if (items.length === 0 && !showSuccessModal) {
    return (
      <section className="mt-8">
        <h1 className="text-3xl font-bold mb-4">Оформлення замовлення</h1>
        <p>Кошик порожній</p>
      </section>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white border border-yellow-200 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none";

  const errorText = "text-red-500 text-sm mt-1";

  return (
    <section className="mt-10 space-y-8 text-[17px]">
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255, 244, 200, 0.35)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div className="bg-gradient-to-b from-[#fffdf7] to-[#fff3d6] border border-yellow-300 rounded-3xl p-7 w-[90%] max-w-md text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-fade-in">
            <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
              Дякуємо за замовлення!
            </h2>

            <p className="text-gray-700 mb-2">
              Ваше замовлення успішно оформлено
            </p>

            <p className="mb-5 text-lg">
              Номер:{" "}
              <span className="font-bold text-orange-500">
                BANANI--{successOrderNumber}
              </span>
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold px-6 py-3 rounded-2xl shadow-md transition hover:scale-105"
            >
              На головну
            </button>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold">Оформлення замовлення</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 rounded-3xl p-6 border-2 border-yellow-300 shadow-xl space-y-4"
        >
          <h2 className="text-xl font-semibold">Ваші дані</h2>

          <div>
            <input
              placeholder="Ім’я"
              value={customerName}
              onChange={(event) => {
                setCustomerName(event.target.value);
                validateField("customerName", event.target.value);
              }}
              className={inputClass}
            />
            {errors.customerName && (
              <p className={errorText}>{errors.customerName}</p>
            )}
          </div>

          <div>
            <input
              placeholder="+380XXXXXXXXX"
              value={customerPhone}
              onChange={(event) => handlePhoneChange(event.target.value)}
              className={inputClass}
            />
            {errors.customerPhone && (
              <p className={errorText}>{errors.customerPhone}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              value={customerEmail}
              onChange={(event) => {
                setCustomerEmail(event.target.value);
                validateField("customerEmail", event.target.value);
              }}
              className={inputClass}
            />
            {errors.customerEmail && (
              <p className={errorText}>{errors.customerEmail}</p>
            )}
          </div>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={isPickup}
              onChange={(event) => handlePickupChange(event.target.checked)}
            />
            Самовивіз
          </label>

          {!isPickup && (
            <>
              <select
                className={inputClass}
                value={deliveryType}
                onChange={(event) =>
                  setDeliveryType(event.target.value as DeliveryType)
                }
              >
                <option value="COURIER">Кур’єр</option>
                <option value="NOVA_POSHTA">Нова пошта</option>
              </select>

              <div>
                <input
                  placeholder="Місто"
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    validateField("city", event.target.value);
                    fetchCities(event.target.value);
                  }}
                  className={inputClass}
                />

                {citySuggestions.length > 0 && (
                  <div className="bg-white border rounded-xl mt-1 shadow">
                    {citySuggestions.map((currentCity) => (
                      <div
                        key={currentCity}
                        className="px-3 py-2 hover:bg-yellow-100 cursor-pointer"
                        onClick={() => {
                          setCity(currentCity);
                          setCitySuggestions([]);
                          validateField("city", currentCity);
                        }}
                      >
                        {currentCity}
                      </div>
                    ))}
                  </div>
                )}

                {errors.city && <p className={errorText}>{errors.city}</p>}
              </div>

              <div>
                <input
                  placeholder="Адреса"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                    validateField("address", event.target.value);
                  }}
                  className={inputClass}
                />
                {errors.address && (
                  <p className={errorText}>{errors.address}</p>
                )}
              </div>
            </>
          )}

          <select
            className={inputClass}
            value={paymentType}
            onChange={(event) =>
              setPaymentType(event.target.value as PaymentType)
            }
          >
            <option value="CASH">Готівкою</option>
            <option value="CARD_ON_DELIVERY">Карткою</option>
            <option value="ONLINE">Онлайн</option>
          </select>

          <textarea
            placeholder="Коментар"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={`${inputClass} h-24`}
          />

          {message && <p className="text-red-500">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-xl font-semibold"
          >
            {submitting ? "Оформлення..." : "Підтвердити замовлення"}
          </button>
        </form>

        <div className="bg-white/90 rounded-3xl p-6 border-2 border-yellow-300 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Ваше замовлення</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm"
              >
                <p className="font-semibold">{item.productName}</p>
                <p className="text-gray-600">
                  {item.price} × {item.quantity}
                </p>
                <p className="text-orange-500 font-bold">
                  {(item.price * item.quantity).toFixed(2)} грн
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-yellow-300">
            <h3 className="text-xl font-bold">
              Разом: {totalPrice.toFixed(2)} грн
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}