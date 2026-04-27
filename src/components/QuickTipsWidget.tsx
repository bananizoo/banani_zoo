"use client";

import { useState } from "react";

type Tip = {
  id: string;
  title: string;
  content: string;
  category: string | null;
};

export default function QuickTipsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRandomTip() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/faq/random", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Не вдалося завантажити пораду");
        setTip(null);
        return;
      }

      setTip(data.tip);
      setIsOpen(true);
    } catch {
      setMessage("Помилка завантаження поради");
      setTip(null);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleClick() {
    if (!isOpen) {
      await loadRandomTip();
      return;
    }

    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        style={{
          position: "fixed",
          left: "20px",
          bottom: "20px",
          width: "64px",
          height: "64px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💡
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            left: "20px",
            bottom: "95px",
            width: "320px",
            background: "#fff",
            border: "1px solid #ddd",
            padding: "16px",
            zIndex: 1001,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <strong>Швидка порада</strong>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
              }}
            >
              ✕
            </button>
          </div>

          {loading && <p>Завантаження...</p>}

          {!loading && message && <p>{message}</p>}

          {!loading && tip && (
            <>
              {tip.category && (
                <p style={{ fontSize: "12px", opacity: 0.7 }}>
                  {tip.category}
                </p>
              )}

              <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
                {tip.title}
              </h3>

              <p style={{ marginTop: "8px" }}>{tip.content}</p>

              <button
                type="button"
                onClick={loadRandomTip}
                style={{
                  marginTop: "12px",
                  cursor: "pointer",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  background: "#facc15",
                }}
              >
                Інша порада
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}