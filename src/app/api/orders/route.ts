import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Неавторизований користувач" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        orderNumber: true,
        totalPrice: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json(
      { error: "Помилка при отриманні замовлень" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Неавторизований користувач" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      comment,
      deliveryType,
      paymentType,
      city,
      address,
    } = body;

    if (!customerName || !customerPhone || !customerEmail) {
      return NextResponse.json(
        { error: "Заповніть обов'язкові поля" },
        { status: 400 }
      );
    }

    if (!deliveryType || !paymentType) {
      return NextResponse.json(
        { error: "Оберіть доставку та оплату" },
        { status: 400 }
      );
    }

    if (deliveryType !== "PICKUP" && (!city || !address)) {
      return NextResponse.json(
        { error: "Для доставки потрібно вказати місто та адресу" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Кошик порожній" },
        { status: 400 }
      );
    }

    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        customerName,
        customerPhone,
        customerEmail,
        comment: comment || null,
        deliveryType,
        paymentType,
        city: deliveryType === "PICKUP" ? null : city,
        address: deliveryType === "PICKUP" ? null : address,
        totalPrice,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch {
    return NextResponse.json(
      { error: "Помилка при оформленні замовлення" },
      { status: 500 }
    );
  }
}