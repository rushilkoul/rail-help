import { Sparkles, TrainFront, MapPin, Flag } from "lucide-react";
import { confidenceVibe } from "@/data/trains";

export interface Seat {
  train: string;
  coach: string;
  seatNumber: string;
  berth: string;
  vacantTill: string;
  fromStation: string;
  confidence: number;
}

// Lower → LB, Upper → UB, Side Lower → SL, Side Upper → SU, Middle → MB, Window → WS, Aisle → AS
function berthCode(b: string): string {
  const map: Record<string, string> = {
    "lower": "LB",
    "upper": "UB",
    "middle": "MB",
    "side lower": "SL",
    "side upper": "SU",
    "window": "WS",
    "aisle": "AS",
  };
  return map[b.toLowerCase()] ?? b.slice(0, 2).toUpperCase();
}

// Coach prefix → class label
function coachClass(coach: string): { tag: string; tone: "ac" | "sl" | "cc" | "ec" } {
  const p = coach[0]?.toUpperCase();
  if (p === "A") return { tag: "1AC", tone: "ac" };
  if (p === "B") return { tag: "3AC", tone: "ac" };
  if (p === "S") return { tag: "Sleeper", tone: "sl" };
  if (p === "E") return { tag: "Exec Chair", tone: "ec" };
  if (p === "C") return { tag: "Chair Car", tone: "cc" };
  if (p === "H") return { tag: "2AC", tone: "ac" };
  return { tag: "GN", tone: "sl" };
}

const TONE_STYLE: Record<string, string> = {
  ac: "bg-primary/15 border-primary/40 text-primary",
  sl: "bg-muted/40 border-border text-foreground/80",
  cc: "bg-accent/15 border-accent/40 text-accent",
  ec: "bg-success/15 border-success/40 text-success",
};

export function SeatCard({
  seat,
  index,
  route,
}: {
  seat: Seat;
  index: number;
  route?: string[];
}) {
  const conf = seat.confidence;
  const cls = coachClass(seat.coach);
  const vibe = confidenceVibe(conf);

  // High / Medium / Low tiers
  const tier: "hi" | "mid" | "lo" =
    conf >= 85 ? "hi" : conf >= 65 ? "mid" : "lo";
  const tierColor =
    tier === "hi" ? "text-success" : tier === "mid" ? "text-warning" : "text-accent";
  const tierBg =
    tier === "hi"
      ? "bg-success/15 border-success/40"
      : tier === "mid"
        ? "bg-warning/15 border-warning/40"
        : "bg-accent/15 border-accent/40";
  const glow =
    tier === "hi"
      ? "0 0 22px oklch(0.78 0.18 145 / 0.55), 0 0 6px oklch(0.78 0.18 145 / 0.4) inset"
      : tier === "mid"
        ? "0 0 22px oklch(0.82 0.16 90 / 0.5), 0 0 6px oklch(0.82 0.16 90 / 0.35) inset"
        : "0 0 22px oklch(0.68 0.2 25 / 0.5), 0 0 6px oklch(0.68 0.2 25 / 0.35) inset";
  const barGradient =
    tier === "hi"
      ? "linear-gradient(90deg, oklch(0.78 0.18 145), oklch(0.85 0.16 160))"
      : tier === "mid"
        ? "linear-gradient(90deg, oklch(0.82 0.16 90), oklch(0.85 0.18 70))"
        : "linear-gradient(90deg, oklch(0.68 0.2 25), oklch(0.72 0.2 15))";

  // Per-seat route progress
  const fromIdx = route ? Math.max(0, route.indexOf(seat.fromStation)) : 0;
  const tillIdx = route ? Math.max(fromIdx, route.indexOf(seat.vacantTill)) : 0;
  const lastIdx = route ? route.length - 1 : 1;
  const fromPct = lastIdx > 0 ? (fromIdx / lastIdx) * 100 : 0;
  const tillPct = lastIdx > 0 ? (tillIdx / lastIdx) * 100 : 100;

  return (
    <div
      className="group relative rounded-3xl p-5 border border-border/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all active:scale-[0.98] hover:-translate-y-1 hover:border-primary/40"
      style={{
        background: "var(--gradient-card)",
        boxShadow: "var(--shadow-3d)",
        animationDelay: `${index * 70}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* ambient glow accent */}
      <div
        className="absolute -top-20 -right-20 h-44 w-44 rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            tier === "hi"
              ? "oklch(0.78 0.18 145 / 0.25)"
              : tier === "mid"
                ? "oklch(0.82 0.16 90 / 0.25)"
                : "oklch(0.68 0.2 25 / 0.22)",
        }}
      />

      {/* Header: train + tags */}
      <div className="flex items-center justify-between gap-2 mb-3 relative">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground min-w-0">
          <TrainFront className="h-3 w-3 text-primary shrink-0" />
          <span className="font-semibold text-foreground/80 truncate">
            {seat.train}
          </span>
        </div>
        <span
          className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${TONE_STYLE[cls.tone]}`}
        >
          {cls.tag}
        </span>
      </div>

      {/* Main row */}
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div
            className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl border border-primary/30 shrink-0"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.22 0.05 70 / 0.6), oklch(0.12 0.02 260))",
              boxShadow:
                "0 1px 0 oklch(1 0 0 / 0.1) inset, 0 -2px 4px oklch(0 0 0 / 0.4) inset",
            }}
          >
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
              Coach
            </span>
            <span className="text-lg font-bold text-primary leading-none">
              {seat.coach}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight leading-none">
                {seat.seatNumber}
              </span>
              <span
                className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded-md border border-primary/40 bg-primary/10 text-primary"
                title={seat.berth}
              >
                {berthCode(seat.berth)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 truncate capitalize">
              {seat.berth.toLowerCase()} berth
            </p>
          </div>
        </div>

        {/* glowing confidence pill */}
        <div
          className={`flex flex-col items-end gap-1 px-2.5 py-1.5 rounded-2xl border ${tierBg}`}
          style={{ boxShadow: glow }}
        >
          <div className="flex items-center gap-1">
            <Sparkles className={`h-3 w-3 ${tierColor}`} />
            <span className={`text-sm font-black ${tierColor}`}>{conf}%</span>
          </div>
          <span className={`text-[9px] font-bold ${tierColor} whitespace-nowrap`}>
            {vibe.label}
          </span>
        </div>
      </div>

      {/* Route progress line (from → vacantTill) */}
      <div className="mt-4 pt-4 border-t border-dashed border-border/60 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" /> from
          </div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            vacant till <Flag className="h-3 w-3 text-primary" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold truncate max-w-[45%]">
            {seat.fromStation}
          </span>
          <span className="text-xs font-bold truncate max-w-[50%] text-right">
            {seat.vacantTill}
          </span>
        </div>

        <div className="relative h-1.5 rounded-full bg-border/40 overflow-hidden">
          {/* travelled segment */}
          <div
            className="absolute inset-y-0 rounded-full transition-all duration-700"
            style={{
              left: `${fromPct}%`,
              width: `${Math.max(8, tillPct - fromPct)}%`,
              background: barGradient,
              boxShadow: glow,
            }}
          />
          {/* end dot */}
          <span
            className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border border-background transition-all"
            style={{
              left: `calc(${tillPct}% - 5px)`,
              background: barGradient,
              boxShadow: glow,
            }}
          />
        </div>
      </div>

      {/* perforated ticket edge */}
      <div className="absolute left-0 top-[58%] -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-background" />
      <div className="absolute right-0 top-[58%] -translate-y-1/2 translate-x-1/2 h-6 w-6 rounded-full bg-background" />
    </div>
  );
}