export interface WhatsAppOrderDetails {
  productName: string;
  sku: string;
  color?: string;
  quantityMeters: number;
  customerName?: string;
  orderTotal?: number;
}

export function buildWhatsAppOrderMessage(details: WhatsAppOrderDetails): string {
  const lines = [
    "Hello MA Fabrics, I'd like to order:",
    "",
    `Product: ${details.productName}`,
    `SKU: ${details.sku}`,
    details.color ? `Color: ${details.color}` : null,
    `Quantity: ${details.quantityMeters} meters`,
    details.customerName ? `Customer name: ${details.customerName}` : null,
    details.orderTotal ? `Order total: PKR ${details.orderTotal.toLocaleString("en-PK")}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

/** whatsappNumber comes from SiteSetting (admin-configurable) — never hard-code it. */
export function buildWhatsAppUrl(whatsappNumber: string, details: WhatsAppOrderDetails) {
  const message = buildWhatsAppOrderMessage(details);
  const digitsOnly = whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
