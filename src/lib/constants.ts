/**
 * Central constants for the Fernandez & Fernandes website.
 * Change WHATSAPP_NUMBER here to update every button/link across the site.
 */

export const WHATSAPP_NUMBER = "5541995808145";
export const PHONE_NUMBER = "tel:+5541995808145";

/** Build a ready-to-use wa.me URL with an optional pre-filled message. */
export const whatsappUrl = (message = ""): string =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** Build a wa.me URL with a raw (already-encoded) message string. */
export const whatsappUrlRaw = (rawMessage = ""): string =>
  `https://wa.me/${WHATSAPP_NUMBER}${rawMessage ? `?text=${rawMessage}` : ""}`;
