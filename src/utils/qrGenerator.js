import QRCode from "qrcode";

/**
 * Generates a base64-encoded QR image from the given URL.
 * @param {string} text - The text or URL to encode.
 * @returns {Promise<string>} - A base64 data URL string.
 */
export async function generateQRCode(text) {
  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
    });
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR:", error);
    throw new Error("Failed to generate QR code");
  }
}
