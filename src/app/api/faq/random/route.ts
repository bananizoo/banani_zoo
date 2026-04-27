import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tips = await prisma.faqTip.findMany({
      where: {
        isActive: true,
      },
    });

    if (tips.length === 0) {
      return NextResponse.json(
        { error: "Порад поки немає" },
        { status: 404 }
      );
    }

    const randomIndex = Math.floor(Math.random() * tips.length);
    const tip = tips[randomIndex];

    return NextResponse.json({ tip });
  } catch {
    return NextResponse.json(
      { error: "Помилка завантаження поради" },
      { status: 500 }
    );
  }
}