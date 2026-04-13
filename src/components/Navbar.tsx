"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./navbar.css";
import AuthPopup from "./AuthPopup";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Відстеження скролу для розмиття хедеру
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="top-row">
        {/* Ліворуч — Мавпочка з анімацією */}
        <div className="logo-left">
          <Image 
            src="/monkey_logo.png" 
            alt="BaNaNi Monkey" 
            width={78} 
            height={78}
            className="monkey-logo"
            priority
          />
        </div>

        {/* Центр — BANANI Logo */}
        <div className="logo-center">
          <Link href="/">
            <Image 
              src="/banani_logo.png" 
              alt="BaNaNi" 
              width={340} 
              height={98}
              className="banani-logo"
              priority
            />
          </Link>
        </div>

        {/* Праворуч — Пошук + Профіль */}
        <div className="right-block">
          <div className="search-container">
            <input
              type="text"
              placeholder="Що шукає ваш улюбленець?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button 
            className="profile-btn"
            onClick={() => setShowAuthPopup((prev) => !prev)}
          >
            👤
          </button>
        </div>
      </div>

      {/* Меню — вирівняне по центру, об'ємний шрифт */}
      <div className="menu-row">
        <div className="links">
          <Link href="/">Головна</Link>
          <Link href="/about">Про нас</Link>
          <Link href="/calculator">Калькулятор</Link>
          <Link href="/favorites">Обране</Link>
          <Link href="/compare">Порівняння</Link>
          <Link href="/cart">Кошик 🛒</Link>
        </div>
      </div>

      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
    </nav>
  );
}