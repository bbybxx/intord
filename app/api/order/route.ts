import { appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

interface OrderPayload {
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  order: {
    items: unknown[];
    promoCode: string | null;
    subtotal: number;
    discount: number;
    total: number;
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;

    if (!payload?.customer?.name || !payload?.customer?.phone || !payload?.customer?.address) {
      return NextResponse.json({ error: "Некорректные данные заказа" }, { status: 400 });
    }

    const orderId = `${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const logPath = path.resolve(process.cwd(), "orders.log");

    const logEntry = {
      orderId,
      createdAt: new Date().toISOString(),
      ...payload
    };

    await appendFile(logPath, `${JSON.stringify(logEntry)}\n`, "utf8");

    return NextResponse.json({ ok: true, orderId });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить заказ" }, { status: 500 });
  }
}
