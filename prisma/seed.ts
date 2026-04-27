import { PrismaClient, ProductType, PetType, AgeGroup } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient();

function buildSearchNormalized(parts: Array<string | null | undefined>) {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[’'`"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const catFood = await prisma.category.upsert({
    where: { slug: "cat-food" },
    update: { name: "Корм для котів" },
    create: { name: "Корм для котів", slug: "cat-food" },
  });

  const dogFood = await prisma.category.upsert({
    where: { slug: "dog-food" },
    update: { name: "Корм для собак" },
    create: { name: "Корм для собак", slug: "dog-food" },
  });

  const harnesses = await prisma.category.upsert({
    where: { slug: "harnesses" },
    update: { name: "Шлейки" },
    create: { name: "Шлейки", slug: "harnesses" },
  });

  const bowls = await prisma.category.upsert({
    where: { slug: "bowls" },
    update: { name: "Миски" },
    create: { name: "Миски", slug: "bowls" },
  });

  const toys = await prisma.category.upsert({
    where: { slug: "toys" },
    update: { name: "Іграшки" },
    create: { name: "Іграшки", slug: "toys" },
  });

  const hygiene = await prisma.category.upsert({
    where: { slug: "hygiene" },
    update: { name: "Гігієна" },
    create: { name: "Гігієна", slug: "hygiene" },
  });

  await prisma.product.upsert({
    where: { slug: "cat-dry-food-premium" },
    update: {
      name: "Сухий корм Premium для котів",
      description: "Повнораціонний сухий корм для дорослих котів",
      price: 299,
      stock: 12,
      brand: "Purina",
      productType: ProductType.FOOD,
      petType: PetType.CAT,
      ageGroup: AgeGroup.ADULT,
      foodType: "dry",
      caloriesPer100g: 380,
      feedingMinGPerDay: 45,
      feedingMaxGPerDay: 70,
      recommendedWeightMinKg: 2,
      recommendedWeightMaxKg: 6,
      searchKeywords: ["корм", "сухий корм", "котячий корм", "для котів", "cat food", "dry food", "premium"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Premium для котів",
        "Повнораціонний сухий корм для дорослих котів",
        "Purina",
        "корм сухий котячий для котів premium"
      ]),
      searchBoost: 10,
      categoryId: catFood.id,
      isActive: true,
    },
    create: {
      name: "Сухий корм Premium для котів",
      slug: "cat-dry-food-premium",
      description: "Повнораціонний сухий корм для дорослих котів",
      price: 299,
      stock: 12,
      brand: "Purina",
      productType: ProductType.FOOD,
      petType: PetType.CAT,
      ageGroup: AgeGroup.ADULT,
      foodType: "dry",
      caloriesPer100g: 380,
      feedingMinGPerDay: 45,
      feedingMaxGPerDay: 70,
      recommendedWeightMinKg: 2,
      recommendedWeightMaxKg: 6,
      searchKeywords: ["корм", "сухий корм", "котячий корм", "для котів", "cat food", "dry food", "premium"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Premium для котів",
        "Повнораціонний сухий корм для дорослих котів",
        "Purina",
        "корм сухий котячий для котів premium"
      ]),
      searchBoost: 10,
      categoryId: catFood.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "cat-wet-food-salmon" },
    update: {
      name: "Вологий корм з лососем для котів",
      description: "Ніжний вологий корм з лососем",
      price: 79,
      stock: 30,
      brand: "Whiskas",
      productType: ProductType.FOOD,
      petType: PetType.CAT,
      ageGroup: AgeGroup.ADULT,
      foodType: "wet",
      caloriesPer100g: 92,
      feedingMinGPerDay: 180,
      feedingMaxGPerDay: 260,
      recommendedWeightMinKg: 2,
      recommendedWeightMaxKg: 6,
      searchKeywords: ["корм", "вологий корм", "котячий корм", "лосось", "для котів", "wet food"],
      searchNormalized: buildSearchNormalized([
        "Вологий корм з лососем для котів",
        "Ніжний вологий корм з лососем",
        "Whiskas",
        "корм вологий котячий лосось"
      ]),
      searchBoost: 8,
      categoryId: catFood.id,
      isActive: true,
    },
    create: {
      name: "Вологий корм з лососем для котів",
      slug: "cat-wet-food-salmon",
      description: "Ніжний вологий корм з лососем",
      price: 79,
      stock: 30,
      brand: "Whiskas",
      productType: ProductType.FOOD,
      petType: PetType.CAT,
      ageGroup: AgeGroup.ADULT,
      foodType: "wet",
      caloriesPer100g: 92,
      feedingMinGPerDay: 180,
      feedingMaxGPerDay: 260,
      recommendedWeightMinKg: 2,
      recommendedWeightMaxKg: 6,
      searchKeywords: ["корм", "вологий корм", "котячий корм", "лосось", "для котів", "wet food"],
      searchNormalized: buildSearchNormalized([
        "Вологий корм з лососем для котів",
        "Ніжний вологий корм з лососем",
        "Whiskas",
        "корм вологий котячий лосось"
      ]),
      searchBoost: 8,
      categoryId: catFood.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "cat-kitten-food-turkey" },
    update: {
      name: "Сухий корм Kitten з індичкою",
      description: "Сухий корм для кошенят",
      price: 329,
      stock: 18,
      brand: "Royal Canin",
      productType: ProductType.FOOD,
      petType: PetType.CAT,
      ageGroup: AgeGroup.BABY,
      foodType: "dry",
      caloriesPer100g: 410,
      feedingMinGPerDay: 30,
      feedingMaxGPerDay: 55,
      recommendedWeightMinKg: 0.5,
      recommendedWeightMaxKg: 4,
      searchKeywords: ["корм", "сухий корм", "кошеня", "kitten", "котячий корм", "індичка"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Kitten з індичкою",
        "Сухий корм для кошенят",
        "Royal Canin",
        "корм сухий kitten кошеня індичка"
      ]),
      searchBoost: 9,
      categoryId: catFood.id,
      isActive: true,
    },
    create: {
      name: "Сухий корм Kitten з індичкою",
      slug: "cat-kitten-food-turkey",
      description: "Сухий корм для кошенят",
      price: 329,
      stock: 18,
      brand: "Royal Canin",
      productType: ProductType.FOOD,
      petType: PetType.CAT,
      ageGroup: AgeGroup.BABY,
      foodType: "dry",
      caloriesPer100g: 410,
      feedingMinGPerDay: 30,
      feedingMaxGPerDay: 55,
      recommendedWeightMinKg: 0.5,
      recommendedWeightMaxKg: 4,
      searchKeywords: ["корм", "сухий корм", "кошеня", "kitten", "котячий корм", "індичка"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Kitten з індичкою",
        "Сухий корм для кошенят",
        "Royal Canin",
        "корм сухий kitten кошеня індичка"
      ]),
      searchBoost: 9,
      categoryId: catFood.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-dry-food-active" },
    update: {
      name: "Сухий корм Active для собак",
      description: "Сухий корм для активних собак",
      price: 420,
      stock: 8,
      brand: "Royal Canin",
      productType: ProductType.FOOD,
      petType: PetType.DOG,
      ageGroup: AgeGroup.ADULT,
      foodType: "dry",
      caloriesPer100g: 365,
      feedingMinGPerDay: 120,
      feedingMaxGPerDay: 260,
      recommendedWeightMinKg: 8,
      recommendedWeightMaxKg: 25,
      searchKeywords: ["корм", "сухий корм", "собачий корм", "для собак", "dry food", "active"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Active для собак",
        "Сухий корм для активних собак",
        "Royal Canin",
        "корм сухий собачий для собак active"
      ]),
      searchBoost: 10,
      categoryId: dogFood.id,
      isActive: true,
    },
    create: {
      name: "Сухий корм Active для собак",
      slug: "dog-dry-food-active",
      description: "Сухий корм для активних собак",
      price: 420,
      stock: 8,
      brand: "Royal Canin",
      productType: ProductType.FOOD,
      petType: PetType.DOG,
      ageGroup: AgeGroup.ADULT,
      foodType: "dry",
      caloriesPer100g: 365,
      feedingMinGPerDay: 120,
      feedingMaxGPerDay: 260,
      recommendedWeightMinKg: 8,
      recommendedWeightMaxKg: 25,
      searchKeywords: ["корм", "сухий корм", "собачий корм", "для собак", "dry food", "active"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Active для собак",
        "Сухий корм для активних собак",
        "Royal Canin",
        "корм сухий собачий для собак active"
      ]),
      searchBoost: 10,
      categoryId: dogFood.id,
    },
  });

  await prisma.faqTip.createMany({
    data: [
      {
        title: "Як правильно підібрати корм?",
        content:
          "Підбирайте корм відповідно до виду тварини, віку, ваги та рівня активності. Для активних тварин зазвичай потрібна більша добова норма.",
        category: "Корм",
      },
      {
        title: "Як виміряти шию для шлейки?",
        content:
          "Обхват шиї потрібно вимірювати м’якою сантиметровою стрічкою в місці, де зазвичай проходить нашийник.",
        category: "Шлейки",
      },
      {
        title: "Як виміряти груди для шлейки?",
        content:
          "Обхват грудей вимірюється у найширшій частині грудної клітки, одразу за передніми лапами.",
        category: "Шлейки",
      },
      {
        title: "Коли змінювати корм?",
        content:
          "Новий корм бажано вводити поступово протягом 5–7 днів, змішуючи його зі старим кормом.",
        category: "Корм",
      },
      {
        title: "Що робити, якщо товару немає в наявності?",
        content:
          "Якщо товару немає в наявності, краще обрати схожий товар тієї ж категорії або перевірити його пізніше.",
        category: "Каталог",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.product.upsert({
    where: { slug: "dog-wet-food-beef" },
    update: {
      name: "Вологий корм з яловичиною для собак",
      description: "Поживний вологий корм для дорослих собак",
      price: 95,
      stock: 24,
      brand: "Pedigree",
      productType: ProductType.FOOD,
      petType: PetType.DOG,
      ageGroup: AgeGroup.ADULT,
      foodType: "wet",
      caloriesPer100g: 105,
      feedingMinGPerDay: 300,
      feedingMaxGPerDay: 600,
      recommendedWeightMinKg: 5,
      recommendedWeightMaxKg: 25,
      searchKeywords: ["корм", "вологий корм", "собачий корм", "яловичина", "для собак", "wet food"],
      searchNormalized: buildSearchNormalized([
        "Вологий корм з яловичиною для собак",
        "Поживний вологий корм для дорослих собак",
        "Pedigree",
        "корм вологий собачий яловичина"
      ]),
      searchBoost: 8,
      categoryId: dogFood.id,
      isActive: true,
    },
    create: {
      name: "Вологий корм з яловичиною для собак",
      slug: "dog-wet-food-beef",
      description: "Поживний вологий корм для дорослих собак",
      price: 95,
      stock: 24,
      brand: "Pedigree",
      productType: ProductType.FOOD,
      petType: PetType.DOG,
      ageGroup: AgeGroup.ADULT,
      foodType: "wet",
      caloriesPer100g: 105,
      feedingMinGPerDay: 300,
      feedingMaxGPerDay: 600,
      recommendedWeightMinKg: 5,
      recommendedWeightMaxKg: 25,
      searchKeywords: ["корм", "вологий корм", "собачий корм", "яловичина", "для собак", "wet food"],
      searchNormalized: buildSearchNormalized([
        "Вологий корм з яловичиною для собак",
        "Поживний вологий корм для дорослих собак",
        "Pedigree",
        "корм вологий собачий яловичина"
      ]),
      searchBoost: 8,
      categoryId: dogFood.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-puppy-food-chicken" },
    update: {
      name: "Сухий корм Puppy з куркою",
      description: "Сухий корм для цуценят малих і середніх порід",
      price: 389,
      stock: 14,
      brand: "Brit",
      productType: ProductType.FOOD,
      petType: PetType.DOG,
      ageGroup: AgeGroup.BABY,
      foodType: "dry",
      caloriesPer100g: 395,
      feedingMinGPerDay: 60,
      feedingMaxGPerDay: 180,
      recommendedWeightMinKg: 2,
      recommendedWeightMaxKg: 12,
      searchKeywords: ["корм", "сухий корм", "puppy", "цуценя", "собачий корм", "курка"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Puppy з куркою",
        "Сухий корм для цуценят малих і середніх порід",
        "Brit",
        "корм сухий puppy цуценя курка"
      ]),
      searchBoost: 9,
      categoryId: dogFood.id,
      isActive: true,
    },
    create: {
      name: "Сухий корм Puppy з куркою",
      slug: "dog-puppy-food-chicken",
      description: "Сухий корм для цуценят малих і середніх порід",
      price: 389,
      stock: 14,
      brand: "Brit",
      productType: ProductType.FOOD,
      petType: PetType.DOG,
      ageGroup: AgeGroup.BABY,
      foodType: "dry",
      caloriesPer100g: 395,
      feedingMinGPerDay: 60,
      feedingMaxGPerDay: 180,
      recommendedWeightMinKg: 2,
      recommendedWeightMaxKg: 12,
      searchKeywords: ["корм", "сухий корм", "puppy", "цуценя", "собачий корм", "курка"],
      searchNormalized: buildSearchNormalized([
        "Сухий корм Puppy з куркою",
        "Сухий корм для цуценят малих і середніх порід",
        "Brit",
        "корм сухий puppy цуценя курка"
      ]),
      searchBoost: 9,
      categoryId: dogFood.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-harness-classic-s" },
    update: {
      name: "Шлейка Classic S",
      description: "Зручна шлейка для малих собак",
      price: 199,
      stock: 15,
      brand: "Trixie",
      productType: ProductType.HARNESS,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "S",
      neckMinCm: 20,
      neckMaxCm: 30,
      chestMinCm: 32,
      chestMaxCm: 45,
      recommendedWeightMinKg: 3,
      recommendedWeightMaxKg: 7,
      searchKeywords: ["шлейка", "harness", "для собак", "собака", "розмір s", "амуніція"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Classic S",
        "Зручна шлейка для малих собак",
        "Trixie",
        "шлейка harness собака s"
      ]),
      searchBoost: 10,
      categoryId: harnesses.id,
      isActive: true,
    },
    create: {
      name: "Шлейка Classic S",
      slug: "dog-harness-classic-s",
      description: "Зручна шлейка для малих собак",
      price: 199,
      stock: 15,
      brand: "Trixie",
      productType: ProductType.HARNESS,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "S",
      neckMinCm: 20,
      neckMaxCm: 30,
      chestMinCm: 32,
      chestMaxCm: 45,
      recommendedWeightMinKg: 3,
      recommendedWeightMaxKg: 7,
      searchKeywords: ["шлейка", "harness", "для собак", "собака", "розмір s", "амуніція"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Classic S",
        "Зручна шлейка для малих собак",
        "Trixie",
        "шлейка harness собака s"
      ]),
      searchBoost: 10,
      categoryId: harnesses.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-harness-classic-m" },
    update: {
      name: "Шлейка Classic M",
      description: "Шлейка для собак середнього розміру",
      price: 249,
      stock: 11,
      brand: "Trixie",
      productType: ProductType.HARNESS,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "M",
      neckMinCm: 28,
      neckMaxCm: 40,
      chestMinCm: 45,
      chestMaxCm: 60,
      recommendedWeightMinKg: 7,
      recommendedWeightMaxKg: 15,
      searchKeywords: ["шлейка", "harness", "для собак", "собака", "розмір m", "амуніція"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Classic M",
        "Шлейка для собак середнього розміру",
        "Trixie",
        "шлейка harness собака m"
      ]),
      searchBoost: 10,
      categoryId: harnesses.id,
      isActive: true,
    },
    create: {
      name: "Шлейка Classic M",
      slug: "dog-harness-classic-m",
      description: "Шлейка для собак середнього розміру",
      price: 249,
      stock: 11,
      brand: "Trixie",
      productType: ProductType.HARNESS,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "M",
      neckMinCm: 28,
      neckMaxCm: 40,
      chestMinCm: 45,
      chestMaxCm: 60,
      recommendedWeightMinKg: 7,
      recommendedWeightMaxKg: 15,
      searchKeywords: ["шлейка", "harness", "для собак", "собака", "розмір m", "амуніція"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Classic M",
        "Шлейка для собак середнього розміру",
        "Trixie",
        "шлейка harness собака m"
      ]),
      searchBoost: 10,
      categoryId: harnesses.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-harness-classic-l" },
    update: {
      name: "Шлейка Classic L",
      description: "Шлейка для великих собак",
      price: 319,
      stock: 9,
      brand: "Trixie",
      productType: ProductType.HARNESS,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "L",
      neckMinCm: 38,
      neckMaxCm: 52,
      chestMinCm: 58,
      chestMaxCm: 78,
      recommendedWeightMinKg: 15,
      recommendedWeightMaxKg: 35,
      searchKeywords: ["шлейка", "harness", "для собак", "велика собака", "розмір l", "амуніція"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Classic L",
        "Шлейка для великих собак",
        "Trixie",
        "шлейка harness собака l"
      ]),
      searchBoost: 10,
      categoryId: harnesses.id,
      isActive: true,
    },
    create: {
      name: "Шлейка Classic L",
      slug: "dog-harness-classic-l",
      description: "Шлейка для великих собак",
      price: 319,
      stock: 9,
      brand: "Trixie",
      productType: ProductType.HARNESS,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "L",
      neckMinCm: 38,
      neckMaxCm: 52,
      chestMinCm: 58,
      chestMaxCm: 78,
      recommendedWeightMinKg: 15,
      recommendedWeightMaxKg: 35,
      searchKeywords: ["шлейка", "harness", "для собак", "велика собака", "розмір l", "амуніція"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Classic L",
        "Шлейка для великих собак",
        "Trixie",
        "шлейка harness собака l"
      ]),
      searchBoost: 10,
      categoryId: harnesses.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "cat-harness-soft-xs" },
    update: {
      name: "Шлейка Soft XS для котів",
      description: "М'яка шлейка для котів і дрібних тварин",
      price: 189,
      stock: 13,
      brand: "Ferplast",
      productType: ProductType.HARNESS,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "XS",
      neckMinCm: 16,
      neckMaxCm: 24,
      chestMinCm: 24,
      chestMaxCm: 35,
      recommendedWeightMinKg: 1.5,
      recommendedWeightMaxKg: 5,
      searchKeywords: ["шлейка", "harness", "для котів", "кіт", "котяча шлейка", "розмір xs"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Soft XS для котів",
        "Мяка шлейка для котів і дрібних тварин",
        "Ferplast",
        "шлейка harness кіт xs"
      ]),
      searchBoost: 9,
      categoryId: harnesses.id,
      isActive: true,
    },
    create: {
      name: "Шлейка Soft XS для котів",
      slug: "cat-harness-soft-xs",
      description: "М'яка шлейка для котів і дрібних тварин",
      price: 189,
      stock: 13,
      brand: "Ferplast",
      productType: ProductType.HARNESS,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      sizeLabel: "XS",
      neckMinCm: 16,
      neckMaxCm: 24,
      chestMinCm: 24,
      chestMaxCm: 35,
      recommendedWeightMinKg: 1.5,
      recommendedWeightMaxKg: 5,
      searchKeywords: ["шлейка", "harness", "для котів", "кіт", "котяча шлейка", "розмір xs"],
      searchNormalized: buildSearchNormalized([
        "Шлейка Soft XS для котів",
        "Мяка шлейка для котів і дрібних тварин",
        "Ferplast",
        "шлейка harness кіт xs"
      ]),
      searchBoost: 9,
      categoryId: harnesses.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "cat-bowl-green" },
    update: {
      name: "Миска зелена для котів",
      description: "Пластикова миска для корму та води",
      price: 99,
      stock: 22,
      brand: "Ferplast",
      productType: ProductType.ACCESSORY,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["миска", "посуд", "для котів", "котяча миска", "аксесуар"],
      searchNormalized: buildSearchNormalized([
        "Миска зелена для котів",
        "Пластикова миска для корму та води",
        "Ferplast",
        "миска кіт аксесуар"
      ]),
      searchBoost: 5,
      categoryId: bowls.id,
      isActive: true,
    },
    create: {
      name: "Миска зелена для котів",
      slug: "cat-bowl-green",
      description: "Пластикова миска для корму та води",
      price: 99,
      stock: 22,
      brand: "Ferplast",
      productType: ProductType.ACCESSORY,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["миска", "посуд", "для котів", "котяча миска", "аксесуар"],
      searchNormalized: buildSearchNormalized([
        "Миска зелена для котів",
        "Пластикова миска для корму та води",
        "Ferplast",
        "миска кіт аксесуар"
      ]),
      searchBoost: 5,
      categoryId: bowls.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-bowl-steel" },
    update: {
      name: "Миска металева для собак",
      description: "Металева миска для води або корму",
      price: 149,
      stock: 17,
      brand: "Trixie",
      productType: ProductType.ACCESSORY,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["миска", "посуд", "для собак", "собача миска", "аксесуар"],
      searchNormalized: buildSearchNormalized([
        "Миска металева для собак",
        "Металева миска для води або корму",
        "Trixie",
        "миска собака аксесуар"
      ]),
      searchBoost: 5,
      categoryId: bowls.id,
      isActive: true,
    },
    create: {
      name: "Миска металева для собак",
      slug: "dog-bowl-steel",
      description: "Металева миска для води або корму",
      price: 149,
      stock: 17,
      brand: "Trixie",
      productType: ProductType.ACCESSORY,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["миска", "посуд", "для собак", "собача миска", "аксесуар"],
      searchNormalized: buildSearchNormalized([
        "Миска металева для собак",
        "Металева миска для води або корму",
        "Trixie",
        "миска собака аксесуар"
      ]),
      searchBoost: 5,
      categoryId: bowls.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "cat-ball-toy" },
    update: {
      name: "М'ячик-іграшка для котів",
      description: "Легка іграшка для активних котів",
      price: 89,
      stock: 25,
      brand: "PetFun",
      productType: ProductType.TOY,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["іграшка", "мячик", "м'ячик", "для котів", "toy", "кіт"],
      searchNormalized: buildSearchNormalized([
        "Мячик-іграшка для котів",
        "Легка іграшка для активних котів",
        "PetFun",
        "іграшка мячик кіт"
      ]),
      searchBoost: 4,
      categoryId: toys.id,
      isActive: true,
    },
    create: {
      name: "М'ячик-іграшка для котів",
      slug: "cat-ball-toy",
      description: "Легка іграшка для активних котів",
      price: 89,
      stock: 25,
      brand: "PetFun",
      productType: ProductType.TOY,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["іграшка", "мячик", "м'ячик", "для котів", "toy", "кіт"],
      searchNormalized: buildSearchNormalized([
        "Мячик-іграшка для котів",
        "Легка іграшка для активних котів",
        "PetFun",
        "іграшка мячик кіт"
      ]),
      searchBoost: 4,
      categoryId: toys.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-rope-toy" },
    update: {
      name: "Канат-іграшка для собак",
      description: "Міцна іграшка для собак середніх порід",
      price: 129,
      stock: 19,
      brand: "PetFun",
      productType: ProductType.TOY,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["іграшка", "канат", "для собак", "toy", "собака"],
      searchNormalized: buildSearchNormalized([
        "Канат-іграшка для собак",
        "Міцна іграшка для собак середніх порід",
        "PetFun",
        "іграшка канат собака"
      ]),
      searchBoost: 4,
      categoryId: toys.id,
      isActive: true,
    },
    create: {
      name: "Канат-іграшка для собак",
      slug: "dog-rope-toy",
      description: "Міцна іграшка для собак середніх порід",
      price: 129,
      stock: 19,
      brand: "PetFun",
      productType: ProductType.TOY,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["іграшка", "канат", "для собак", "toy", "собака"],
      searchNormalized: buildSearchNormalized([
        "Канат-іграшка для собак",
        "Міцна іграшка для собак середніх порід",
        "PetFun",
        "іграшка канат собака"
      ]),
      searchBoost: 4,
      categoryId: toys.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "cat-shampoo-gentle" },
    update: {
      name: "Шампунь Gentle для котів",
      description: "Делікатний шампунь для догляду за шерстю",
      price: 159,
      stock: 10,
      brand: "VetLine",
      productType: ProductType.HYGIENE,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["шампунь", "гігієна", "для котів", "догляд", "шерсть"],
      searchNormalized: buildSearchNormalized([
        "Шампунь Gentle для котів",
        "Делікатний шампунь для догляду за шерстю",
        "VetLine",
        "шампунь гігієна кіт"
      ]),
      searchBoost: 3,
      categoryId: hygiene.id,
      isActive: true,
    },
    create: {
      name: "Шампунь Gentle для котів",
      slug: "cat-shampoo-gentle",
      description: "Делікатний шампунь для догляду за шерстю",
      price: 159,
      stock: 10,
      brand: "VetLine",
      productType: ProductType.HYGIENE,
      petType: PetType.CAT,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["шампунь", "гігієна", "для котів", "догляд", "шерсть"],
      searchNormalized: buildSearchNormalized([
        "Шампунь Gentle для котів",
        "Делікатний шампунь для догляду за шерстю",
        "VetLine",
        "шампунь гігієна кіт"
      ]),
      searchBoost: 3,
      categoryId: hygiene.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "dog-shampoo-fresh" },
    update: {
      name: "Шампунь Fresh для собак",
      description: "Очищувальний шампунь для собак",
      price: 169,
      stock: 12,
      brand: "VetLine",
      productType: ProductType.HYGIENE,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["шампунь", "гігієна", "для собак", "догляд", "шерсть"],
      searchNormalized: buildSearchNormalized([
        "Шампунь Fresh для собак",
        "Очищувальний шампунь для собак",
        "VetLine",
        "шампунь гігієна собака"
      ]),
      searchBoost: 3,
      categoryId: hygiene.id,
      isActive: true,
    },
    create: {
      name: "Шампунь Fresh для собак",
      slug: "dog-shampoo-fresh",
      description: "Очищувальний шампунь для собак",
      price: 169,
      stock: 12,
      brand: "VetLine",
      productType: ProductType.HYGIENE,
      petType: PetType.DOG,
      ageGroup: AgeGroup.UNIVERSAL,
      searchKeywords: ["шампунь", "гігієна", "для собак", "догляд", "шерсть"],
      searchNormalized: buildSearchNormalized([
        "Шампунь Fresh для собак",
        "Очищувальний шампунь для собак",
        "VetLine",
        "шампунь гігієна собака"
      ]),
      searchBoost: 3,
      categoryId: hygiene.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }

);