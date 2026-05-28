import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Train, MapPin, Search, Sofa, TrainFront, Route as RouteIcon } from "lucide-react";
import { SeatCard, type Seat } from "@/components/SeatCard";
import { TrainAutocomplete } from "@/components/TrainAutocomplete";
import { TRAINS, findTrain, LOADING_LINES, EMPTY_LINES } from "@/data/trains";

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

function Index() {
  const defaultTrain = TRAINS[0];
  const [train, setTrain] = useState(`${defaultTrain.number} ${defaultTrain.name}`);
  const selectedTrain = useMemo(
    () => findTrain(train) ?? defaultTrain,
    [train, defaultTrain],
  );
  const stations = selectedTrain.stations;
  const coaches = selectedTrain.coaches;

  const [from, setFrom] = useState(stations[0]);
  const [coach, setCoach] = useState<string>("ALL");
  const [results, setResults] = useState<Seat[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);

  useEffect(() => {
    setCoach("ALL");
    setFrom(selectedTrain.stations[0]);
    setResults(null);
  }, [selectedTrain.number, selectedTrain.stations]);

  const onSearch = () => {
    setLoading(true);
    setResults(null);
    setLoadingLine(
      LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)],
    );
    setTimeout(() => {
      const all = selectedTrain.seats;
      const filtered =
        coach === "ALL" ? all : all.filter((s) => s.coach === coach);
      setResults(filtered);
      setLoading(false);
    }, 700);
  };

  const emptyLine = useMemo(
    () => EMPTY_LINES[Math.floor(Math.random() * EMPTY_LINES.length)],
    [],
  );

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
            live af
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
          crowdsourced vacancy intel for Indian Railways — coach by coach,
          station by station. no cap, big W energy. 🚆
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
        <Field icon={<Train className="h-4 w-4" />} label="train — drop the digits">
          <TrainAutocomplete
            value={train}
            onChange={setTrain}
            onPick={(t) => setTrain(`${t.number} ${t.name}`)}
            options={TRAINS}
            placeholder="e.g. 12951 or Rajdhani"
          />
        </Field>

        <Field icon={<MapPin className="h-4 w-4" />} label="boarding stn — where u hopping on">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-transparent outline-none text-base font-semibold appearance-none cursor-pointer"
          >
            {stations.map((s) => (
              <option key={s} value={s} className="bg-card text-foreground">
                {s}
              </option>
            ))}
          </select>
        </Field>

        <RouteProgress stations={stations} active={from} />

        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
            <Sofa className="h-3 w-3" /> coach — pick ur whip
          </label>
          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 no-scrollbar">
            {["ALL", ...coaches].map((c) => {
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
          {loading ? loadingLine : "clock empty seats 👀"}
        </button>
      </section>

      {/* Results */}
      <section>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider">
            {results
              ? `${results.length} seats secured${coach !== "ALL" ? ` · ${coach}` : ""} 🔓`
              : "recent scans"}
          </h3>
          {results && (
            <span className="text-[10px] text-muted-foreground">
              fresh outta the oven
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

        {!loading && results && results.length > 0 && (
          <div className="space-y-3">
            {results.map((s, i) => (
              <SeatCard key={i} seat={s} index={i} />
            ))}
          </div>
        )}

        {!loading && results && results.length === 0 && (
          <div
            className="rounded-3xl p-6 border border-dashed border-border/60 text-center"
            style={{ background: "oklch(0.12 0.018 260 / 0.4)" }}
          >
            <p className="text-sm text-muted-foreground">
              nah this coach cooked 😭 — try another one bestie
            </p>
          </div>
        )}

        {!loading && !results && (
          <div
            className="rounded-3xl p-6 border border-dashed border-border/60 text-center"
            style={{ background: "oklch(0.12 0.018 260 / 0.4)" }}
          >
            <p className="text-sm text-muted-foreground">{emptyLine}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function RouteProgress({
  stations,
  active,
}: {
  stations: string[];
  active: string;
}) {
  const activeIdx = Math.max(0, stations.indexOf(active));
  const pct =
    stations.length > 1 ? (activeIdx / (stations.length - 1)) * 100 : 0;
  return (
    <div className="mb-4 px-1">
      <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <RouteIcon className="h-3 w-3" /> route — big W ride
      </div>
      <div className="relative h-1.5 rounded-full bg-border/40 overflow-hidden mb-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background: "var(--gradient-hero)",
            boxShadow: "var(--shadow-glow)",
          }}
        />
      </div>
      <div className="flex justify-between gap-1">
        {stations.map((s, i) => {
          const passed = i <= activeIdx;
          const code = s.match(/\(([^)]+)\)/)?.[1] ?? s.slice(0, 3).toUpperCase();
          return (
            <div
              key={s}
              className="flex flex-col items-center gap-1 flex-1 min-w-0"
            >
              <span
                className="h-2 w-2 rounded-full transition-all"
                style={{
                  background: passed
                    ? "var(--gradient-hero)"
                    : "oklch(0.3 0.02 260)",
                  boxShadow: passed ? "var(--shadow-glow)" : "none",
                }}
              />
              <span
                className={`text-[9px] font-bold tracking-wider truncate ${
                  passed ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {code}
              </span>
            </div>
          );
        })}
      </div>
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
