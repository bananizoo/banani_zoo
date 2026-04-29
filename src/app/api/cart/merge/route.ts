import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items || [];

    const cookieStore = await cookies();
const token = cookieStore.get("banani_session")?.value;

    if (!token) {
      return Response.json({ error: "Not authorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.userId },
      });
    }

    for (const item of items) {
      const existing = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity + item.quantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          },
        });
      }
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}