import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      message: "Вихід виконано успішно",
    });
  } catch {
    return NextResponse.json(
      { error: "Помилка сервера" },
      { status: 500 }
    );
  }
}