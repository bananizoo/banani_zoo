import Image from "next/image";
import ProductCatalog from "@/components/ProductCatalog";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="space-y-12 text-[17px]">

      {/* HERO */}
      <section
        className="
          rounded-[32px] p-10 flex flex-col lg:flex-row items-center justify-between gap-8
          border-2 border-yellow-300
          bg-gradient-to-br from-[#fff4cc] via-[#ffe082] to-[#ffd54f]
          shadow-[0_20px_60px_rgba(255,180,0,0.35),0_0_25px_rgba(255,200,0,0.25)]
        "
      >
        <div className="max-w-xl">
          <span className="inline-block bg-yellow-300/70 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium mb-4">
            BaNaNi • зоомагазин
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Все для ваших улюбленців 🐾
          </h1>

          <p className="text-lg text-gray-700">
            Обирайте найкращі товари для собак, котів та інших тварин.
          </p>
        </div>

        <Image
          src="/logo.png"
          alt="BaNaNi"
          width={300}
          height={160}
          className="drop-shadow-2xl"
          priority
        />
      </section>

      {/* КАТАЛОГ */}
      <Suspense fallback={<div className="text-center py-10">Завантаження каталогу...</div>}>
        <ProductCatalog />
      </Suspense>

    </div>
  );
}