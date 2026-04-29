"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import "./navbar.css";
import AuthPopup from "./AuthPopup";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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

  async function loadFavoritesCount() {
    const response = await fetch("/api/favorites", {
      credentials: "include",
    });

    if (!response.ok) {
      setFavoritesCount(0);
      return;
    }

    const data = await response.json();
    setFavoritesCount(data.count || 0);
  }

  useEffect(() => {
    loadFavoritesCount();

    function handleFavoritesUpdated() {
      loadFavoritesCount();
    }

    window.addEventListener("favorites-updated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favorites-updated", handleFavoritesUpdated);
    };
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

  function getLinkClass(path: string) {
    return pathname === path ? "active-link" : "";
  }

  function scrollMenu(direction: "left" | "right") {
    menuRef.current?.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth",
    });
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
            type="button"
          >
            👤
          </button>
        </div>
      </div>

      <div className="menu-row">
        <button
          className="menu-scroll-btn menu-scroll-btn-left"
          onClick={() => scrollMenu("left")}
          type="button"
          aria-label="Прокрутити меню вліво"
        >
          ‹
        </button>

        <div className="links" ref={menuRef}>
          <Link href="/" className={getLinkClass("/")}>
            Головна
          </Link>

          <Link href="/about" className={getLinkClass("/about")}>
            Про нас
          </Link>

          <Link href="/calculator" className={getLinkClass("/calculator")}>
            Калькулятор
          </Link>

          <Link href="/favorites" className={getLinkClass("/favorites")}>
            Обране {favoritesCount > 0 && <span>({favoritesCount})</span>}
          </Link>

          <Link href="/compare" className={getLinkClass("/compare")}>
            Порівняння
          </Link>
        </div>

        <button
          className="menu-scroll-btn menu-scroll-btn-right"
          onClick={() => scrollMenu("right")}
          type="button"
          aria-label="Прокрутити меню вправо"
        >
          ›
        </button>
      </div>

      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
    </nav>
  );
}