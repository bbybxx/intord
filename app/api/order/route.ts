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
// Use environment variables for bot token and chat ID
// Fallback values are provided for development, but should be set in production
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8681128796:AAFnWPfhhiSq1nLmxg-_sxBo7suVH55C-U0";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "592052544";

async function sendTelegramMessage(message: string) {
  if (!TELEGRAM_CHAT_ID) {
    console.warn("TELEGRAM_CHAT_ID is not set, skipping Telegram notification");
    return { success: false, error: "TELEGRAM_CHAT_ID not configured" };
  }

  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("TELEGRAM_BOT_TOKEN is not set, skipping Telegram notification");
    return { success: false, error: "TELEGRAM_BOT_TOKEN not configured" };
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

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Failed to send Telegram message:", responseData);
      return { 
        success: false, 
        error: `Telegram API error: ${responseData.description || 'Unknown error'}` 
      };
    }
    
    console.log("Telegram message sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

function formatOrderMessage(orderId: string, payload: OrderPayload): string {
  const { customer, order } = payload;
  
  // Format items list
  const itemsText = (order.items as any[]).map((item) => {
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

    // Log order to console (works in both development and production)
    console.log("New order received:", {
      orderId,
      customer: payload.customer,
      orderSummary: {
        itemCount: payload.order.items.length,
        total: payload.order.total,
        subtotal: payload.order.subtotal,
        discount: payload.order.discount
      }
    });

    // Send notification to Telegram
    const message = formatOrderMessage(orderId, payload);
    const telegramResult = await sendTelegramMessage(message);

    if (!telegramResult.success) {
      console.warn("Telegram notification failed:", telegramResult.error);
      // Continue processing order even if Telegram fails
    }

    return NextResponse.json({ 
      ok: true, 
      orderId,
      telegramSent: telegramResult.success
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json({ 
      error: "Не удалось сохранить заказ",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
