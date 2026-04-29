import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getActivityMultiplier(activity: string) {
  if (activity === "low") return 0.85;
  if (activity === "high") return 1.25;
  return 1;
}

function getAgeMultiplier(age: string) {
  if (age === "BABY") return 1.4;
  if (age === "SENIOR") return 0.85;
  return 1;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculatorType } = body;

    if (calculatorType === "food") {
      const { petType, weightKg, ageGroup, activityLevel } = body;

      const weight = Number(weightKg);

      if (!petType || !weight || !ageGroup || !activityLevel) {
        return NextResponse.json(
          { error: "Заповніть усі поля" },
          { status: 400 }
        );
      }

      const baseGrams = weight * 30;
      const dailyGrams = Math.round(
        baseGrams *
          getActivityMultiplier(activityLevel) *
          getAgeMultiplier(ageGroup)
      );

      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          stock: { gt: 0 },
          productType: "FOOD",
          petType,
          OR: [{ ageGroup }, { ageGroup: "UNIVERSAL" }],
        },
        include: {
          category: true,
        },
        orderBy: [
          { searchBoost: "desc" },
          { price: "asc" },
        ],
        take: 3,
      });

      return NextResponse.json({
        dailyGrams,
        products,
      });
    }

    if (calculatorType === "harness") {
      const { petType, neckCm, chestCm, backLengthCm } = body;

      const neck = Number(neckCm);
      const chest = Number(chestCm);

      if (!petType || !neck || !chest) {
        return NextResponse.json(
          { error: "Вкажіть тип тварини, обхват шиї та грудей" },
          { status: 400 }
        );
      }

      let products = await prisma.product.findMany({
        where: {
          isActive: true,
          stock: { gt: 0 },
          productType: "HARNESS",
          petType,
          neckMinCm: { lte: neck },
          neckMaxCm: { gte: neck },
          chestMinCm: { lte: chest },
          chestMaxCm: { gte: chest },
        },
        include: {
          category: true,
        },
        orderBy: [
          { searchBoost: "desc" },
          { price: "asc" },
        ],
        take: 3,
      });

      if (products.length === 0) {
        products = await prisma.product.findMany({
          where: {
            isActive: true,
            stock: { gt: 0 },
            productType: "HARNESS",
            petType,
          },
          include: {
            category: true,
          },
          orderBy: [
            { searchBoost: "desc" },
            { price: "asc" },
          ],
          take: 3,
        });
      }

      return NextResponse.json({
        neckCm: neck,
        chestCm: chest,
        backLengthCm: backLengthCm ? Number(backLengthCm) : null,
        products,
      });
    }

    return NextResponse.json(
      { error: "Невідомий калькулятор" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Помилка розрахунку" },
      { status: 500 }
    );
  }
}