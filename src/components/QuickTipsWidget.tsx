"use client";

import { useState } from "react";
import styles from "./quickTipsWidget.module.css";

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
  className={styles.tipButton}
>
  💡
</button>

      {isOpen && (
  <div className={styles.tipModal}>
    <div className={styles.tipHeader}>
      <strong className={styles.tipLabel}>Швидка порада</strong>

      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className={styles.closeButton}
      >
        ✕
      </button>
    </div>

    {loading && <p className={styles.text}>Завантаження...</p>}

    {!loading && message && <p className={styles.text}>{message}</p>}

    {!loading && tip && (
      <>
        {tip.category && (
          <p className={styles.category}>{tip.category}</p>
        )}

        <h3 className={styles.title}>{tip.title}</h3>

        <p className={styles.text}>{tip.content}</p>

        <button
          type="button"
          onClick={loadRandomTip}
          className={styles.nextButton}
        >
          Наступна порада
        </button>
      </>
    )}
  </div>
)}
    </>
  );
}