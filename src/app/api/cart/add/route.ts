import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Потрібна авторизація" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, productName, price, quantity } = body;

    if (!productId || !productName || !price || !quantity) {
      return NextResponse.json(
        { error: "Некоректні дані товару" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Кошик не знайдено" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + Number(quantity),
        },
      });

      return NextResponse.json({
        message: "Кількість товару оновлено",
        item: updatedItem,
      });
    }

    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        productName,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return NextResponse.json({
      message: "Товар додано в кошик",
      item,
    });
  } catch {
    return NextResponse.json(
      { error: "Помилка сервера" },
      { status: 500 }
    );
  }
}