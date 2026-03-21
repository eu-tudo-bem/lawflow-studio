/// <reference types="vite/client" />

interface Window {
  gtag: (
    command: "config" | "event" | "js" | "set" | "consent",
    targetIdOrEventName: string,
    params?: Record<string, unknown>
  ) => void;
  dataLayer: Record<string, unknown>[];
  fbq: (...args: unknown[]) => void;
}
