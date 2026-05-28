import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Train, MapPin, Search, Sofa, TrainFront } from "lucide-react";
import { SeatCard, type Seat } from "@/components/SeatCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RailVacant — Find empty seats on Indian trains" },
      {
        name: "description",
        content:
          "Modern seat vacancy finder for Indian Railways. Search trains, pick a coach, see which seats are free till your station.",
      },
      { property: "og:title", content: "RailVacant" },
      {
        property: "og:description",
        content: "Find vacant seats on Indian trains — coach by coach.",
      },
    ],
  }),
  component: Index,
});

const STATIONS = [
  "New Delhi (NDLS)",
  "Mumbai Central (BCT)",
  "Howrah Jn (HWH)",
  "Chennai Central (MAS)",
  "Bengaluru (SBC)",
  "Hyderabad Deccan (HYB)",
  "Pune Jn (PUNE)",
  "Ahmedabad Jn (ADI)",
  "Jaipur Jn (JP)",
  "Lucknow (LKO)",
  "Patna Jn (PNBE)",
  "Bhopal Jn (BPL)",
];

const COACHES = ["S1", "S2", "S3", "S4", "S5", "B1", "B2", "B3", "A1", "A2"];

function generateSeats(coach: string, station: string): Seat[] {
  const berths = ["Lower", "Upper", "Middle", "Side L", "Side U"];
  const pool = STATIONS.filter((s) => s !== station);
  return Array.from({ length: 6 }).map((_, i) => {
    const num = 7 + i * 11 + coach.length * 3;
    return {
      coach,
      seatNumber: String((num % 72) + 1).padStart(2, "0"),
      berth: berths[i % berths.length],
      vacantTill: pool[(i * 2) % pool.length].split(" (")[0],
      fromStation: station.split(" (")[0],
      confidence: 95 - i * 7 + (i % 2 === 0 ? 2 : -3),
    };
  });
}

function Index() {
  const [train, setTrain] = useState("12951");
  const [from, setFrom] = useState(STATIONS[0]);
  const [coach, setCoach] = useState("S4");
  const [results, setResults] = useState<Seat[] | null>(null);
  const [loading, setLoading] = useState(false);

  const onSearch = () => {
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(generateSeats(coach, from));
      setLoading(false);
    }, 700);
  };

  const headerStats = useMemo(
    () => [
      { label: "Trains", value: "13k+" },
      { label: "Live", value: "24×7" },
      { label: "Stations", value: "7k+" },
    ],
    [],
  );

  return (
    <div className="min-h-screen mx-auto max-w-md px-5 pb-24 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <TrainFront className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none">
              RailVacant
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              seat scanner
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-success/15 border border-success/30">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold text-success uppercase tracking-wider">
            Live
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mb-6">
        <h2 className="text-[2rem] font-black leading-[1.05] tracking-tight">
          Find{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            empty seats
          </span>{" "}
          before you board.
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Crowdsourced vacancy data for Indian Railways — coach by coach,
          station by station. no cap.
        </p>

        <div className="flex gap-2 mt-4">
          {headerStats.map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-2xl border border-border/60 px-3 py-2 text-center"
              style={{ background: "var(--gradient-card)" }}
            >
              <p className="text-sm font-bold">{s.value}</p>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search Card */}
      <section
        className="rounded-3xl p-5 border border-border/60 mb-7"
        style={{
          background: "var(--gradient-card)",
          boxShadow: "var(--shadow-3d)",
        }}
      >
        <Field icon={<Train className="h-4 w-4" />} label="Train number / name">
          <input
            value={train}
            onChange={(e) => setTrain(e.target.value)}
            placeholder="e.g. 12951 Rajdhani"
            className="w-full bg-transparent outline-none text-base font-semibold placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field icon={<MapPin className="h-4 w-4" />} label="Boarding station">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-transparent outline-none text-base font-semibold appearance-none cursor-pointer"
          >
            {STATIONS.map((s) => (
              <option key={s} value={s} className="bg-card text-foreground">
                {s}
              </option>
            ))}
          </select>
        </Field>

        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
            <Sofa className="h-3 w-3" /> Coach
          </label>
          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 no-scrollbar">
            {COACHES.map((c) => {
              const active = c === coach;
              return (
                <button
                  key={c}
                  onClick={() => setCoach(c)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all ${
                    active
                      ? "border-primary/60 text-primary-foreground"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    active
                      ? {
                          background: "var(--gradient-hero)",
                          boxShadow: "var(--shadow-glow)",
                        }
                      : { background: "oklch(0.16 0.02 260)" }
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full h-13 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          style={{
            background: "var(--gradient-hero)",
            color: "oklch(0.12 0.02 260)",
            boxShadow: "var(--shadow-glow), var(--shadow-3d)",
          }}
        >
          <Search className="h-5 w-5" />
          {loading ? "Scanning coach…" : "Find vacant seats"}
        </button>
      </section>

      {/* Results */}
      <section>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider">
            {results ? `${results.length} vacant in ${coach}` : "Recent scans"}
          </h3>
          {results && (
            <span className="text-[10px] text-muted-foreground">
              updated just now
            </span>
          )}
        </div>

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-3xl border border-border/60 animate-pulse"
                style={{ background: "var(--gradient-card)" }}
              />
            ))}
          </div>
        )}

        {!loading && results && (
          <div className="space-y-3">
            {results.map((s, i) => (
              <SeatCard key={i} seat={s} index={i} />
            ))}
          </div>
        )}

        {!loading && !results && (
          <div
            className="rounded-3xl p-6 border border-dashed border-border/60 text-center"
            style={{ background: "oklch(0.12 0.018 260 / 0.4)" }}
          >
            <p className="text-sm text-muted-foreground">
              Tap <span className="text-primary font-semibold">Find vacant seats</span>{" "}
              to scan coach <span className="font-bold">{coach}</span>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3 mb-3 border border-border/60"
      style={{
        background: "oklch(0.1 0.018 260)",
        boxShadow: "0 2px 6px oklch(0 0 0 / 0.3) inset",
      }}
    >
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
