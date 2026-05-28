import { ArrowRight, Sparkles } from "lucide-react";

export interface Seat {
  coach: string;
  seatNumber: string;
  berth: string;
  vacantTill: string;
  fromStation: string;
  confidence: number;
}

export function SeatCard({ seat, index }: { seat: Seat; index: number }) {
  const conf = seat.confidence;
  const confColor =
    conf >= 85 ? "text-success" : conf >= 65 ? "text-warning" : "text-accent";
  const confBg =
    conf >= 85
      ? "bg-success/15 border-success/30"
      : conf >= 65
        ? "bg-warning/15 border-warning/30"
        : "bg-accent/15 border-accent/30";

  return (
    <div
      className="group relative rounded-3xl p-5 border border-border/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{
        background: "var(--gradient-card)",
        boxShadow: "var(--shadow-3d)",
        animationDelay: `${index * 70}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div
            className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl border border-primary/30"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.22 0.05 70 / 0.6), oklch(0.12 0.02 260))",
              boxShadow:
                "0 1px 0 oklch(1 0 0 / 0.1) inset, 0 -2px 4px oklch(0 0 0 / 0.4) inset",
            }}
          >
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Coach
            </span>
            <span className="text-lg font-bold text-primary leading-none">
              {seat.coach}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">
                {seat.seatNumber}
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {seat.berth}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              from {seat.fromStation}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border ${confBg}`}
        >
          <Sparkles className={`h-3 w-3 ${confColor}`} />
          <span className={`text-xs font-bold ${confColor}`}>{conf}%</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-border/60 relative">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Vacant till
        </p>
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-primary" />
          <span className="text-base font-semibold">{seat.vacantTill}</span>
        </div>
      </div>

      {/* perforated ticket edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-background" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 rounded-full bg-background" />
    </div>
  );
}