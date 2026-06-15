import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo,  useState } from "react";
import { Train, MapPin, Search, Sofa, TrainFront, Route as RouteIcon } from "lucide-react";

import { SeatCard, type Seat } from "@/components/SeatCard";
import { LOADING_LINES, EMPTY_LINES } from "@/data/trains";
import { getTrainInfo } from "@/lib/railwaydata";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RailVacant - Find empty seats on Indian trains" },
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

  
 
  const [apiStations, setApiStations] = useState<string[]>([]);

  const [train, setTrain] = useState("");
const [trainName, setTrainName] = useState("");
  
  const stations = apiStations;
      const [from, setFrom] = useState("");
      const [coach, setCoach] = useState<string>("ALL");
      const [results, setResults] = useState<Seat[] | null>(null);
      const [loading, setLoading] = useState(false);
      const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
    
     
      const coaches = ["A1", "A2", "B1", "B2", "B3"];
  
 
  
  useEffect(() => {
    setCoach("ALL");
  
    if (stations.length > 0) {
      setFrom(stations[0]);
    }
  
    setResults(null);
  }, [stations]);
  const onSearch = async () => {
    const trainNumber = train.trim();

    if (!trainNumber) {
      alert("Please enter a train number.");
      return;
    }
    
    if (trainNumber.length !== 5) {
      alert("Please enter a valid 5-digit train number.");
      return;
    }
    setLoading(true);
    setResults(null);
    setLoadingLine(
      LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)],
    );
    let fetchedTrainName = "";
let stations: string[] = [];
    try {
      const data = await getTrainInfo(trainNumber);
    
      const trainData = data?.body?.[0]?.trains?.[0];
      if (
        !trainData ||
        String(trainData.trainNumber) !== trainNumber
      ) {
        throw new Error("Invalid train number");
      }

      fetchedTrainName = trainData?.trainName || "";
      
      setTrainName(fetchedTrainName);
    
       stations =
        trainData?.schedule?.map(
          (s: any) => s.stationName
        ) || [];
    
      setApiStations(stations);
    
      if (stations.length > 0) {
        setFrom(stations[0]);
      }
    } catch (err) {
      console.error(err);
      alert("Train not found. Please enter a valid train number.");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      if (stations.length === 0) {
        setLoading(false);
        return;
      }
      const generatedSeats: Seat[] = Array.from({ length: 12 }, (_, i) => ({
      train: `${train} ${fetchedTrainName}`,
        coach:
          coach === "ALL"
            ? coaches[Math.floor(Math.random() * coaches.length)]
            : coach,
    
        seatNumber: String(i + 1).padStart(2, "0"),
    
        berth: ["Lower", "Middle", "Upper", "Side Lower", "Side Upper"][
          Math.floor(Math.random() * 5)
        ],
    
        vacantTill:
        stations[Math.floor(Math.random() * stations.length)] || "",
    
        fromStation: from,
        confidence: Math.floor(Math.random() * 30) + 70,
      }));
    
      setResults(generatedSeats);
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
            live
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
        <Field icon={<Train className="h-4 w-4" />} label="train — drop the digits">
        <input
  value={train}
  onChange={(e) => setTrain(e.target.value)}
placeholder="e.g. 12951, 12051, 12627"
  className="w-full bg-transparent outline-none text-base font-semibold"
/>
        </Field>

        <Field icon={<MapPin className="h-4 w-4" />} label="boarding stn — where u hopping on">
        {trainName && (
  <p className="text-sm text-muted-foreground mb-3">
    {trainName}
  </p>
)}
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
              <SeatCard key={i} seat={s} index={i}route={apiStations}/>
            ))}
          </div>
        )}

        {!loading && results && results.length === 0 && (
          <div
            className="rounded-3xl p-6 border border-dashed border-border/60 text-center"
            style={{ background: "oklch(0.12 0.018 260 / 0.4)" }}
          >
            <p className="text-sm text-muted-foreground">
              nah this coach cooked  — try another one 
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
  const displayStations =
  stations.length > 8
    ? [
        stations[0],
        stations[Math.floor(stations.length / 2)],
        stations[stations.length - 1],
      ]
    : stations;
  const activeIdx = Math.max(0, stations.indexOf(active));
  const pct =
    stations.length > 1 ? (activeIdx / (stations.length - 1)) * 100 : 0;
  return (
    <div className="mb-4 px-1">
      <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <RouteIcon className="h-3 w-3" /> route — big  ride
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
        {displayStations.map((s, i) => {
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
