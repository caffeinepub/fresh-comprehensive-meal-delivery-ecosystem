function getPinFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = hash * 31 + id.charCodeAt(i) >>> 0;
  }
  const pin = 1e3 + hash % 9e3;
  return pin.toString();
}
function getQrUrl(data, size = 180) {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=M`;
}
function buildBookingQrPayload(bookingId) {
  const pin = getPinFromId(bookingId);
  return `FRESH:BOOKING:${bookingId}:PIN:${pin}`;
}
export {
  getQrUrl as a,
  buildBookingQrPayload as b,
  getPinFromId as g
};
