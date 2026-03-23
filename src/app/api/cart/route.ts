import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Потрібна авторизація" },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json(
      { error: "Помилка сервера" },
      { status: 500 }
    );
  }
}