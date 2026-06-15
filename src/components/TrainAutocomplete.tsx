import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Train, X } from "lucide-react";

export interface TrainOption {
  number: string;
  name: string;
  route?: string;
}

const RECENT_KEY = "railvacant:recent-trains";
const MAX_RECENT = 5;

export function loadRecent(): TrainOption[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as TrainOption[]) : [];
  } catch {
    return [];
  }
}

export function pushRecent(t: TrainOption) {
  if (typeof window === "undefined") return;
  const cur = loadRecent().filter((x) => x.number !== t.number);
  const next = [t, ...cur].slice(0, MAX_RECENT);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function TrainAutocomplete({
  value,
  onChange,
  onPick,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (t: TrainOption) => void;
  options: TrainOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<TrainOption[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setRecent(loadRecent()), []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = value.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return [];
    return options
      .filter(
        (t) =>
          t.number.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [q, options]);

  const showRecent = open && !q && recent.length > 0;
  const showMatches = open && q.length > 0 && matches.length > 0;
  const showEmpty = open && q.length > 0 && matches.length === 0;

  const pick = (t: TrainOption) => {
    pushRecent(t);
    setRecent(loadRecent());
    onPick(t);
    setOpen(false);
  };

  const clearRecent = () => {
    window.localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? "Search train no. or name"}
        className="w-full bg-transparent outline-none text-base font-semibold placeholder:text-muted-foreground/60"
      />

      {(showRecent || showMatches || showEmpty) && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-2xl border border-border/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: "oklch(0.13 0.02 260)",
            boxShadow: "var(--shadow-3d)",
          }}
        >
          {showRecent && (
            <div>
              <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> ur recent picks
                </span>
                <button
                  onClick={clearRecent}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                >
                  <X className="h-3 w-3" /> clear
                </button>
              </div>
              <ul className="pb-1.5">
                {recent.map((t, i) => (
                  <Row key={t.number} t={t} onPick={pick} delay={i * 25} />
                ))}
              </ul>
            </div>
          )}

          {showMatches && (
            <div>
              <div className="px-3 pt-2.5 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <Train className="h-3 w-3" /> matches — pure fire
              </div>
              <ul className="pb-1.5">
                {matches.map((t, i) => (
                  <Row
                    key={t.number}
                    t={t}
                    onPick={pick}
                    delay={i * 25}
                    highlight={q}
                  />
                ))}
              </ul>
            </div>
          )}

          {showEmpty && (
            <div className="px-4 py-5 text-center text-xs text-muted-foreground">
              no trains lowkey match{" "}
              <span className="text-foreground font-semibold">"{value}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  t,
  onPick,
  delay,
  highlight,
}: {
  t: TrainOption;
  onPick: (t: TrainOption) => void;
  delay: number;
  highlight?: string;
}) {
  return (
    <li
      className="animate-in fade-in slide-in-from-top-1 duration-200"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onPick(t)}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 active:bg-primary/15 transition-colors text-left"
      >
        <div
          className="h-9 w-12 rounded-lg flex items-center justify-center text-[11px] font-black text-primary border border-primary/30 shrink-0"
          style={{ background: "oklch(0.18 0.04 70 / 0.5)" }}
        >
          {t.number}
        </div>
        <div className="min-w-0 flex-1">
  <p className="text-sm font-semibold truncate">
    {highlight ? <Highlight text={t.name} q={highlight} /> : t.name}
  </p>

  <p className="text-[11px] text-muted-foreground">
    Train No. {t.number}
  </p>
</div>
      </button>
    </li>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-primary">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}