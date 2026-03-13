/**
 * Derive a 4-digit numeric PIN from any string ID (booking/order ID).
 * Simple, deterministic, no backend needed.
 */
export function getPinFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  // Produce a 4-digit PIN (1000-9999)
  const pin = 1000 + (hash % 9000);
  return pin.toString();
}

/**
 * Returns a QR code image URL (Google Charts API) encoding the given text.
 */
export function getQrUrl(data: string, size = 180): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=M`;
}

/**
 * Build a QR payload string for a booking.
 * Format:  FRESH:BOOKING:<id>:PIN:<pin>
 */
export function buildBookingQrPayload(bookingId: string): string {
  const pin = getPinFromId(bookingId);
  return `FRESH:BOOKING:${bookingId}:PIN:${pin}`;
}
