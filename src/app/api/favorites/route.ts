import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Неавторизований користувач" }, { status: 401 });
  }

  const favorites = await prisma.favoriteItem.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    favorites,
    count: favorites.length,
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Неавторизований користувач" }, { status: 401 });
  }

  const { productId } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Не передано productId" }, { status: 400 });
  }

  await prisma.favoriteItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      productId,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Неавторизований користувач" }, { status: 401 });
  }

  const { productId } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Не передано productId" }, { status: 400 });
  }

  await prisma.favoriteItem.deleteMany({
    where: {
      userId: user.id,
      productId,
    },
  });

  return NextResponse.json({ success: true });
}