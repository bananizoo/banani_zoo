import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[’'`"]/g, "")
    .replace(/\s+/g, " ");
}

function applySearchCorrections(query: string) {
  const normalized = normalizeText(query);

  const corrections: Record<string, string> = {
    кром: "корм",
    карм: "корм",
    харнесс: "шлейка",
    шлеяка: "шлейка",
    шлейак: "шлейка",
    кот: "кіт",
    кошачий: "котячий",
    собачий: "для собак",
  };

  return corrections[normalized] || normalized;
}

function expandSearchTerms(query: string) {
  const normalized = applySearchCorrections(query);

  const synonymMap: Record<string, string[]> = {
    корм: ["корм", "сухий корм", "вологий корм", "food"],
    шлейка: ["шлейка", "harness", "амуніція"],
    кіт: ["кіт", "котячий", "для котів", "cat"],
    собака: ["собака", "собачий", "для собак", "dog"],
    кошеня: ["кошеня", "kitten"],
    цуценя: ["цуценя", "puppy"],
    миска: ["миска", "посуд"],
    іграшка: ["іграшка", "toy"],
    шампунь: ["шампунь", "гігієна"],
  };

  const words = normalized.split(" ").filter(Boolean);
  const expanded = new Set<string>();

  for (const word of words) {
    expanded.add(word);

    if (synonymMap[word]) {
      for (const synonym of synonymMap[word]) {
        expanded.add(synonym);
      }
    }
  }

  if (expanded.size === 0 && normalized) {
    expanded.add(normalized);
  }

  return Array.from(expanded);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawSearch = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const petType = searchParams.get("petType")?.trim() || "";
    const productType = searchParams.get("productType")?.trim() || "";
    const brand = searchParams.get("brand")?.trim() || "";
    const ageGroup = searchParams.get("ageGroup")?.trim() || "";
    const foodType = searchParams.get("foodType")?.trim() || "";
    const sizeLabel = searchParams.get("sizeLabel")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = Math.max(Number(pageParam) || 1, 1);
    const limit = Math.max(Number(limitParam) || 12, 1);
    const skip = (page - 1) * limit;

    const searchTerms = rawSearch ? expandSearchTerms(rawSearch) : [];
    const correctedSearch = rawSearch ? applySearchCorrections(rawSearch) : "";

    const where: any = {
      isActive: true,
    };

    if (searchTerms.length > 0) {
      where.OR = [
        ...searchTerms.map((term) => ({
          name: {
            contains: term,
            mode: "insensitive",
          },
        })),
        ...searchTerms.map((term) => ({
          description: {
            contains: term,
            mode: "insensitive",
          },
        })),
        ...searchTerms.map((term) => ({
          brand: {
            contains: term,
            mode: "insensitive",
          },
        })),
        ...searchTerms.map((term) => ({
          searchNormalized: {
            contains: term,
            mode: "insensitive",
          },
        })),
        ...searchTerms.map((term) => ({
          searchKeywords: {
            has: term,
          },
        })),
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (petType) {
      where.petType = petType;
    }

    if (productType) {
      where.productType = productType;
    }

    if (brand) {
      where.brand = {
        contains: brand,
        mode: "insensitive",
      };
    }

    if (ageGroup) {
      where.ageGroup = ageGroup;
    }

    if (foodType) {
      where.foodType = {
        equals: foodType,
        mode: "insensitive",
      };
    }

    if (sizeLabel) {
      where.sizeLabel = {
        equals: sizeLabel,
        mode: "insensitive",
      };
    }

    if (minPriceParam || maxPriceParam) {
      where.price = {};

      if (minPriceParam) {
        where.price.gte = Number(minPriceParam);
      }

      if (maxPriceParam) {
        where.price.lte = Number(maxPriceParam);
      }
    }

    let orderBy: any = [{ searchBoost: "desc" }, { createdAt: "desc" }];

    if (sort === "price_asc") {
      orderBy = [{ price: "asc" }];
    } else if (sort === "price_desc") {
      orderBy = [{ price: "desc" }];
    } else if (sort === "name_asc") {
      orderBy = [{ name: "asc" }];
    } else if (sort === "name_desc") {
      orderBy = [{ name: "desc" }];
    } else if (sort === "oldest") {
      orderBy = [{ createdAt: "asc" }];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      searchMeta: {
        rawSearch,
        correctedSearch,
        searchTerms,
      },
      filters: {
        category,
        petType,
        productType,
        brand,
        ageGroup,
        foodType,
        sizeLabel,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        sort,
      },
    });
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      { error: "Помилка при отриманні товарів" },
      { status: 500 }
    );
  }
}