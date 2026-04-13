"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import "./navbar.css";
import AuthPopup from "./AuthPopup";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearch(currentSearch);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      router.push("/");
      return;
    }

    router.push(`/?search=${encodeURIComponent(trimmedSearch)}`);
  }

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="top-row">
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

        <div className="right-block">
          <form onSubmit={handleSearchSubmit} className="search-container">
            <input
              type="text"
              placeholder="Що шукає ваш улюбленець?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <button
            className="profile-btn"
            onClick={() => setShowAuthPopup((prev) => !prev)}
          >
            👤
          </button>
        </div>
      </div>

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