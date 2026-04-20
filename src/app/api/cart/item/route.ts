import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("banani_session")?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Неавторизований користувач" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const productId = body.productId;
  const quantity = body.quantity;

  if (!productId || typeof quantity !== "number") {
    return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    return NextResponse.json({ error: "Кошик не знайдено" }, { status: 404 });
  }

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Товар у кошику не знайдено" },
      { status: 404 }
    );
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    return NextResponse.json({ success: true, deleted: true });
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Неавторизований користувач" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const productId = body.productId;

  if (!productId) {
    return NextResponse.json({ error: "Не передано productId" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    return NextResponse.json({ error: "Кошик не знайдено" }, { status: 404 });
  }

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Товар у кошику не знайдено" },
      { status: 404 }
    );
  }

  await prisma.cartItem.delete({
    where: { id: item.id },
  });

  return NextResponse.json({ success: true });
}