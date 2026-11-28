import { create } from "zustand";

export type Booking = {
  id: string;
  tourId: string;
  date: string;
  people: number;
  pay: number;
  fee: number;
  payout: number;
};

type State = {
  ready: boolean;
  items: Booking[];
  hydrate: () => void;
  add: (booking: Omit<Booking, "id">) => void;
  remove: (id: string) => void;
};

const KEY = "gm-bookings";

function read(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === "object" && "tourId" in item) as Booking[];
  } catch {
    return [];
  }
}

export const useBookings = create<State>((set, get) => ({
  ready: false,
  items: [],
  hydrate: () => {
    if (get().ready) return;
    set({ items: read(), ready: true });
  },
  add: (booking) => {
    const items = [{ ...booking, id: crypto.randomUUID() }, ...get().items];
    localStorage.setItem(KEY, JSON.stringify(items));
    set({ items, ready: true });
  },
  remove: (id) => {
    const items = get().items.filter((item) => item.id !== id);
    localStorage.setItem(KEY, JSON.stringify(items));
    set({ items });
  },
}));
