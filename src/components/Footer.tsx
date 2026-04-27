"use client";

import Image from "next/image";
import { FaInstagram, FaTiktok, FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-24">

      {/* 🌊 ХВИЛЯ */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-[120px] block"
      >
        <path
          d="M0,40C120,80,240,80,360,60C480,40,600,0,720,10C840,20,960,80,1080,90C1200,100,1320,60,1440,40V120H0Z"
          fill="#ffe082"
        />
      </svg>

      {/* 🟡 ФУТЕР */}
      <div className="bg-[#ffe082] pt-10 pb-6 text-center shadow-inner -mt-[6px]">

        {/* 🐵 ЛОГО */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/monkey_logo.png"
            alt="BaNaNi"
            width={60}
            height={60}
          />
          <h2 className="text-xl font-bold">BaNaNi</h2>
          <p className="text-sm opacity-80">
            Турбота про хвостиків 💛
          </p>
        </div>

        {/* 🔗 НАВІГАЦІЯ */}
        <div className="flex flex-wrap justify-center gap-5 mt-5 font-medium footer-links">
          <a href="/">Головна</a>
          <a href="/about">Про нас</a>
          <a href="/calculator">Калькулятор</a>
          <a href="/favorites">Обране</a>
          <a href="/compare">Порівняння</a>
          <a href="/cart">Кошик</a>
        </div>

        {/* 📱 СОЦМЕРЕЖІ */}
        <div className="flex justify-center gap-5 mt-6">
          <a href="#" className="social-icon">
            <FaInstagram />
          </a>
          <a href="#" className="social-icon">
            <FaTiktok />
          </a>
          <a href="#" className="social-icon">
            <FaTelegramPlane />
          </a>
        </div>

        {/* © */}
        <p className="text-sm opacity-70 mt-5">
          © {new Date().getFullYear()} BaNaNi
        </p>
      </div>
    </footer>
  );
}