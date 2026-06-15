import type { Seat } from "@/components/SeatCard";




// vibe helpers
export function confidenceVibe(c: number): { label: string; tone: "hi" | "mid" | "lo" } {
  if (c >= 85) return { label: "W seat fr 🔥", tone: "hi" };
  if (c >= 65) return { label: "might be valid 👀", tone: "mid" };
  return { label: "hell nah gang 😭", tone: "lo" };
}

export const LOADING_LINES = [
  "clocking the coach… 👀",
  "asking the TTE rn fr",
  "scanning seats, hold up",
  "doing the math no cap",
];

export const EMPTY_LINES = [
  "type a train and lock in 🔒",
  "we got the seats, you got the vibes",
  "tap search to clock empty seats 👀",
];