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

// Telegram Bot API configuration
const TELEGRAM_BOT_TOKEN = "8681128796:AAFnWPfhhiSq1nLmxg-_sxBo7suVH55C-U0";
// Chat ID will be obtained from environment variable or from bot updates
// For now, we'll use an environment variable
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message: string) {
  if (!TELEGRAM_CHAT_ID) {
    console.warn("TELEGRAM_CHAT_ID is not set, skipping Telegram notification");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send Telegram message:", error);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

function formatOrderMessage(orderId: string, payload: OrderPayload): string {
  const { customer, order } = payload;
  
  // Format items list
  const itemsText = order.items.map((item: any) => {
    return `• ${item.name} (Размер: ${item.selectedSize}, Кол-во: ${item.quantity}) - ${item.price * item.quantity} RUB`;
  }).join('\n');

  return `
<b>🎉 Новый заказ #${orderId}</b>

<b>👤 Клиент:</b>
• Имя: ${customer.name}
• Телефон: ${customer.phone}
• Адрес: ${customer.address}

<b>🛒 Товары:</b>
${itemsText}

<b>💰 Сумма заказа:</b>
• Сумма: ${order.subtotal} RUB
• Скидка: ${order.discount} RUB
• Промокод: ${order.promoCode || 'нет'}
• <b>Итого: ${order.total} RUB</b>

<b>📅 Дата:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();
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

    // Save to log file
    await appendFile(logPath, `${JSON.stringify(logEntry)}\n`, "utf8");

    // Send notification to Telegram
    const message = formatOrderMessage(orderId, payload);
    await sendTelegramMessage(message);

    return NextResponse.json({ ok: true, orderId });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json({ error: "Не удалось сохранить заказ" }, { status: 500 });
  }
}
