import Image from "next/image";
import ProductCatalog from "@/components/ProductCatalog";

type HomePageProps = {
  searchParams: {
    search?: string;
    sort?: string;
    petType?: string;
    productType?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const sort = params.sort || "newest";
  const petType = params.petType || "";
  const productType = params.productType || "";

  return (
    <div className="space-y-12 text-[17px]">

      {/* HERO */}
      <section className="bg-gradient-to-br from-yellow-200 via-yellow-50 to-yellow-100 rounded-3xl shadow-xl border-2 border-yellow-300 p-10 flex flex-col lg:flex-row items-center justify-between gap-8">

        <div className="max-w-xl">
          <span className="inline-block bg-yellow-300/60 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium mb-4">
            BaNaNi • зоомагазин
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Все для ваших улюбленців 🐾
          </h1>

          <p className="text-lg text-gray-700 mb-6">
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

      {/* КАТАЛОГ (ОДИН БЛОК!) */}
      <div
        className="
          bg-yellow-50/90 backdrop-blur-md p-6 rounded-3xl border-2 border-yellow-300 shadow-xl

          /* SELECT */
          [&_select]:text-[16px]
          [&_select]:px-4
          [&_select]:py-2.5
          [&_select]:rounded-xl
          [&_select]:border-2
          [&_select]:border-yellow-300
          [&_select]:bg-yellow-50
          [&_select]:transition
          [&_select:hover]:border-yellow-400
          [&_select:focus]:border-yellow-500
          [&_select:focus]:outline-none
          [&_select:focus]:ring-2
          [&_select:focus]:ring-yellow-300

          /* BUTTON */
          [&_button]:text-[15px]
          [&_button]:bg-yellow-400
          [&_button]:text-yellow-900
          [&_button]:font-medium
          [&_button]:px-4
          [&_button]:py-2
          [&_button]:rounded-xl
          [&_button]:transition
          [&_button:hover]:bg-yellow-500

          /* КАРТКИ */
          [&_.bg-white]:bg-yellow-50
          [&_.bg-white]:border-2
          [&_.bg-white]:border-yellow-300
          [&_.bg-white]:shadow-md
          [&_.bg-white]:transition
          [&_.bg-white:hover]:shadow-xl
          [&_.bg-white:hover]:-translate-y-1

          /* ЦІНА */
          [&_.text-orange-600]:text-orange-500
          [&_.text-orange-600]:font-extrabold
          [&_.text-orange-600]:text-2xl
        "
      >
        <ProductCatalog
          search={search}
          initialSort={sort}
          initialPetType={petType}
          initialProductType={productType}
        />
      </div>
    </div>
  );
}