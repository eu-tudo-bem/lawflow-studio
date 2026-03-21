/**
 * Centralised conversion tracking for Google Ads, GA4, GTM and Facebook Pixel.
 *
 * Google Ads ID: AW-17373132555
 * Generic conversion label: TboiCNnqlP0bEIvuk9xA
 *
 * Landing-page-specific labels can be added to ADS_CONVERSION_LABELS below once
 * distinct conversion actions are created inside the Google Ads account.
 */

const AW_ID = "AW-17373132555";

const ADS_CONVERSION_LABELS: Record<string, string> = {
  pensao_alimenticia: "TboiCNnqlP0bEIvuk9xA",
  divorcio_consensual: "TboiCNnqlP0bEIvuk9xA",
  cobranca_aluguel: "TboiCNnqlP0bEIvuk9xA",
  direito_agrario: "TboiCNnqlP0bEIvuk9xA",
  transferencia_veiculos: "TboiCNnqlP0bEIvuk9xA",
  contato: "TboiCNnqlP0bEIvuk9xA",
};

type ConversionEvent = "form_submit" | "whatsapp_click" | "phone_click";

// ─── Generic page-level conversion ───────────────────────────────────────────

export const trackConversion = (
  event: ConversionEvent,
  landingPage: string,
) => {
  if (typeof window === "undefined") return;

  const { gtag, fbq, dataLayer } = window;

  // GA4 custom event
  if (gtag) {
    gtag("event", event, {
      event_category: "conversao",
      event_label: landingPage,
    });
  }

  // Google Ads – labelled conversion
  if (gtag) {
    const label = ADS_CONVERSION_LABELS[landingPage];
    if (label) {
      gtag("event", "conversion", {
        send_to: `${AW_ID}/${label}`,
      });
    }
    // Generic fallback picked up by GTM
    gtag("event", "conversion", {
      send_to: AW_ID,
      event_category: "conversao",
      event_label: landingPage,
      conversion_action: event,
    });
  }

  // GTM dataLayer
  if (dataLayer) {
    dataLayer.push({
      event: "lp_conversion",
      conversion_type: event,
      landing_page: landingPage,
    });
  }

  // Facebook Pixel
  if (fbq) {
    fbq("track", event === "form_submit" ? "Lead" : "Contact");
  }
};

// ─── Targeted Google Ads conversion (for specific conversion labels) ──────────

/**
 * Fire a Google Ads conversion event using a specific conversion label.
 *
 * @param conversionLabel - The conversion label from Google Ads (e.g. 'WHATSAPP_LEAD')
 * @param value           - Optional monetary value of the conversion in BRL
 */
export const trackGoogleAdsConversion = (
  conversionLabel: string,
  value?: number,
) => {
  if (typeof window === "undefined") return;

  const { gtag, dataLayer } = window;

  if (gtag) {
    gtag("event", "conversion", {
      send_to: `${AW_ID}/${conversionLabel}`,
      ...(value !== undefined && { value, currency: "BRL" }),
    });
  }

  // Also push to GTM dataLayer so Tag Manager rules can react
  if (dataLayer) {
    dataLayer.push({
      event: "ads_conversion",
      conversion_label: conversionLabel,
      ...(value !== undefined && { conversion_value: value, conversion_currency: "BRL" }),
    });
  }
};
