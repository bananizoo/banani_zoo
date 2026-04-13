import ProductCatalog from "@/components/ProductCatalog";

type HomePageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search || "";

  return (
    <div>
      <section className="bg-white/80 rounded-3xl shadow-lg border border-yellow-300 p-8">
        <h1 className="text-4xl font-bold mb-4">
          Ласкаво просимо до "BaNaNi"
        </h1>
        <p className="text-lg">
          Зоомагазин у самому серці Миколаєва 🐾
        </p>
      </section>

      <ProductCatalog search={search} />
    </div>
  );
}