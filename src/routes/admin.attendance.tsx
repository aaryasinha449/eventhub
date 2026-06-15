import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useState, useEffect, useRef } from "react";
import { ticketsApi } from "@/lib/api";
import { toast } from "sonner";
import { ScanLine, CheckCircle2, XCircle, Camera, CameraOff } from "lucide-react";
import type { Ticket } from "@/lib/types";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

export const Route = createFileRoute("/admin/attendance")({
  head: () => ({ meta: [{ title: "Attendance — EventHub Admin" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><Page /></DashboardLayout></RequireAuth>,
});

type Entry = { ts: string; ok: boolean; code: string; reason?: string };

function Page() {
  const [code, setCode] = useState("");
  const [gate, setGate] = useState("Main Entrance");
  const [log, setLog] = useState<Entry[]>([]);
  const [last, setLast] = useState<{ ok: boolean; ticket?: Ticket; reason?: string } | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Helper to safely execute check-in without throwing expected business errors
  const executeCheckIn = async (codeToVerify: string, gateToVerify: string) => {
    try {
      return await ticketsApi.checkIn(codeToVerify, gateToVerify);
    } catch (err: any) {
      const errMsg = err.message || String(err);
      try {
        const parsed = JSON.parse(errMsg);
        if (parsed.code === "already_checked_in" || parsed.message === "Ticket already checked in") {
          return { ok: false, reason: "Already checked in" };
        }
        if (parsed.code === "ticket_not_found" || parsed.message === "Ticket not found") {
          return { ok: false, reason: "Ticket not found" };
        }
        return { ok: false, reason: parsed.message || "Invalid ticket" };
      } catch {
        if (errMsg.includes("already checked in") || errMsg.includes("already_checked_in")) {
          return { ok: false, reason: "Already checked in" };
        }
        throw err; // Re-throw true network failures
      }
    }
  };

  // ── Manual form submit ────────────────────────────────────────────────────
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    try {
      const res = await executeCheckIn(code, gate);
      setLast(res);
      setLog((l) => [{ ts: new Date().toLocaleTimeString(), ok: res.ok, code, reason: res.reason }, ...l].slice(0, 25));
      if (res.ok) toast.success("Admitted");
      else toast.error(res.reason ?? "Invalid");
    } catch (err: any) {
      toast.error("Network error. Please try again.");
    }
    
    setCode("");
  };

  // ── Camera QR scanner ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!scannerActive) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: 250,
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
          Html5QrcodeScanType.SCAN_TYPE_FILE
        ]
      },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText: string) => {
        // Only pause if the scanner is actively using the camera (state 2 = SCANNING)
        const isCameraScan = scanner.getState() === 2;
        if (isCameraScan) {
          try {
            await scanner.pause(true);
          } catch (e) {
            console.warn("Could not pause scanner:", e);
          }
        }

        const ticketCode = decodedText.split("|")[0];

        try {
          const res = await executeCheckIn(ticketCode, gate);

          setLast(res);
          setLog((l) =>
            [{ ts: new Date().toLocaleTimeString(), ok: res.ok, code: ticketCode, reason: res.reason }, ...l].slice(0, 25)
          );

          if (res.ok) {
            toast.success("Admitted");
            setScannerActive(false);
          } else {
            toast.error(res.reason ?? "Invalid");
            if (isCameraScan) {
              try {
                await scanner.resume();
              } catch (e) {
                console.warn("Could not resume scanner:", e);
              }
            }
          }
        } catch (err) {
          toast.error("Network error. Please try again.");
          if (isCameraScan) {
            try { await scanner.resume(); } catch (e) {}
          }
        }
      },
      (_errorMessage: string) => {
        // QR decode errors are frequent and expected — suppress them
      }
    );

    // Cleanup: stop camera on unmount or when scannerActive flips to false
    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [scannerActive, gate]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">Verify QR codes at the door. Hardware scanners type the code into the field — submit on enter.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="glass rounded-2xl p-6">
          {/* ── Manual entry form ── */}
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Gate</span>
              <input value={gate} onChange={(e) => setGate(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Ticket code or QR payload</span>
              <div className="relative mt-1">
                <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <input
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="EVH-AUR-7K2X9P"
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-3 font-mono text-sm uppercase tracking-wider focus:border-primary/60 outline-none"
                />
              </div>
            </label>
            <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Verify &amp; admit</button>
          </form>

          {/* ── Result banner ── */}
          {last && (
            <div className={`mt-6 rounded-xl border p-4 ${last.ok ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/10" : "border-destructive/40 bg-destructive/10"}`}>
              <div className="flex items-center gap-2">
                {last.ok ? <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" /> : <XCircle className="h-5 w-5 text-[color:var(--destructive)]" />}
                <p className="font-display text-lg">{last.ok ? "Admitted" : "Denied"}</p>
              </div>
              {last.reason && <p className="mt-2 text-sm font-medium text-destructive">{last.reason}</p>}
              
              {last.ticket && last.ok && (
                <div className="mt-3 flex flex-col gap-1 rounded-lg bg-background/50 p-3">
                  {last.ticket.userName ? (
                    <p className="text-sm font-medium">{last.ticket.userName}</p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">Unknown Attendee</p>
                  )}
                  <p className="font-mono text-xs text-muted-foreground">Ticket: {last.ticket.code}</p>
                  <p className="text-xs text-muted-foreground">Time: {new Date().toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Camera QR scanner ── */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScannerActive(true)}
                disabled={scannerActive}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Camera className="h-4 w-4" />
                Start QR Scanner
              </button>
              <button
                type="button"
                onClick={() => setScannerActive(false)}
                disabled={!scannerActive}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <CameraOff className="h-4 w-4" />
                Stop Scanner
              </button>
            </div>

            {/* html5-qrcode mounts into this div when active */}
            {scannerActive && (
              <div className="overflow-hidden rounded-xl border border-border bg-black/5 relative">
                <div className="absolute top-2 right-3 z-10 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white shadow backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]"></span>
                  </span>
                  Scanning...
                </div>
                <div id="qr-reader" />
              </div>
            )}
          </div>
        </section>

        {/* ── Entry log sidebar ── */}
        <aside className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg">Entry log</h2>
          {log.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No scans yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {log.map((e, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${e.ok ? "bg-[color:var(--success)]" : "bg-[color:var(--destructive)]"}`} />
                    <span className="font-mono text-xs">{e.code}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{e.ts}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
