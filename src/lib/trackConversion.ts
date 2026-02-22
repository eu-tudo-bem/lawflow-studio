/**
 * Centralised conversion tracking for Google Ads, GA4, GTM and Facebook Pixel.
 *
 * Google Ads conversion labels per landing page (to be updated once actual
 * conversion actions are created in the Google Ads account):
 *
 *   LP                       | Label placeholder
 *   -------------------------|--------------------------
 *   pensao_alimenticia       | AW-17373132555/pensao
 *   divorcio_consensual      | AW-17373132555/divorcio
 *   cobranca_aluguel         | AW-17373132555/aluguel
 *   direito_agrario          | AW-17373132555/agrario
 *   transferencia_veiculos   | AW-17373132555/veiculos
 */

const AW_ID = "AW-17373132555";

// Map each landing page label to its Google Ads conversion label.
// Replace the values below with the real conversion labels generated in
// Google Ads → Tools → Conversions once you create each conversion action.
const ADS_CONVERSION_LABELS: Record<string, string> = {
  pensao_alimenticia: "",      // e.g. "AbCdEfGhIjK"
  divorcio_consensual: "",
  cobranca_aluguel: "",
  direito_agrario: "",
  transferencia_veiculos: "",
};

type ConversionEvent = "form_submit" | "whatsapp_click" | "phone_click";

export const trackConversion = (
  event: ConversionEvent,
  landingPage: string,
) => {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  const fbq = (window as any).fbq;
  const dataLayer = (window as any).dataLayer;

  // --- GA4 custom event ---
  if (gtag) {
    gtag("event", event, {
      event_category: "conversao",
      event_label: landingPage,
    });
  }

  // --- Google Ads conversion ---
  if (gtag) {
    const label = ADS_CONVERSION_LABELS[landingPage];
    if (label) {
      gtag("event", "conversion", {
        send_to: `${AW_ID}/${label}`,
      });
    }
    // Always fire a generic ads conversion event for GTM to pick up
    gtag("event", "conversion", {
      send_to: AW_ID,
      event_category: "conversao",
      event_label: landingPage,
      conversion_action: event,
    });
  }

  // --- GTM dataLayer push ---
  if (dataLayer) {
    dataLayer.push({
      event: "lp_conversion",
      conversion_type: event,
      landing_page: landingPage,
    });
  }

  // --- Facebook Pixel ---
  if (fbq) {
    fbq("track", event === "form_submit" ? "Lead" : "Contact");
  }
};
