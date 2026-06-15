import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QRTicket({ payload, code, eventTitle, attendeeName, venue, when }: {
  payload: string;
  code: string;
  eventTitle: string;
  attendeeName: string;
  venue: string;
  when: string;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(payload, { width: 320, margin: 1, color: { dark: "#0d0d0d", light: "#f5f0e0" } }).then(setDataUrl);
  }, [payload]);

  return (
    <div className="glass-strong overflow-hidden rounded-2xl">
      <div className="relative p-6" style={{ background: "var(--gradient-gold)" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--primary-foreground)]">EventHub Ticket</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-[color:var(--primary-foreground)]">{eventTitle}</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendee</p>
            <p className="text-sm font-medium">{attendeeName}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Venue</p>
            <p className="text-sm">{venue}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">When</p>
            <p className="text-sm">{when}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ticket code</p>
            <p className="font-mono text-sm tracking-wider text-primary">{code}</p>
          </div>
        </div>
        <div className="mx-auto">
          {dataUrl ? (
            <img src={dataUrl} alt="QR code" className="h-40 w-40 rounded-lg border border-border bg-white p-1" />
          ) : (
            <div className="h-40 w-40 animate-pulse rounded-lg bg-secondary" />
          )}
        </div>
      </div>
    </div>
  );
}
