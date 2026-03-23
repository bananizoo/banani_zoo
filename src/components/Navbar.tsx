"use client";

import Link from "next/link";
import { useState } from "react";
import "./navbar.css";
import AuthPopup from "./AuthPopup";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  return (
    <nav className="navbar">
      <div className="top-row">
        <div className="logo">Зоомагазин "BaNaNi"</div>
      </div>

      <div className="menu-row">
        <div className="links">
          <Link href="/">Головна</Link>
          <Link href="/about">Про нас</Link>
          <Link href="/calculator">Калькулятор</Link>
          <Link href="/favorites">Обране</Link>
          <Link href="/compare">Порівняння</Link>
          <Link href="/cart">Кошик</Link>
        </div>

        <div className="right-block">
          <div className="search">
            <input
              type="text"
              placeholder="Пошук"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="profile-wrapper">
            <button
              className="profile"
              onClick={() => setShowAuthPopup((prev) => !prev)}
            >
              👤
            </button>

            {showAuthPopup && (
              <AuthPopup onClose={() => setShowAuthPopup(false)} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}