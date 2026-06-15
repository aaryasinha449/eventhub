export const formatMoney = (price: number, currency = "USD") =>
  price === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("en-US", opts);

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const relativeTime = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const day = 86400_000;
  const hr = 3600_000;
  const min = 60_000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs > day) return rtf.format(Math.round(diff / day), "day");
  if (abs > hr) return rtf.format(Math.round(diff / hr), "hour");
  return rtf.format(Math.round(diff / min), "minute");
};
