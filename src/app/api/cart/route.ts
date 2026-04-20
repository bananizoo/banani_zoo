import { NextResponse } from "next/server";
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

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Неавторизований користувач" },
      { status: 401 }
    );
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
      include: { items: true },
    });
  }

  const totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return NextResponse.json({
    cart,
    totalPrice,
  });
}