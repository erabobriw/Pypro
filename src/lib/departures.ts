export const SEAT_CAPACITY = 8;

export function upcomingSaturdays(count = 6, now = new Date()): string[] {
  const start = new Date(now);
  start.setHours(12, 0, 0, 0);
  const add = (6 - start.getDay() + 7) % 7 || 7;
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + add + i * 7);
    dates.push(day.toISOString().slice(0, 10));
  }
  return dates;
}

function seedTaken(tourId: string, date: string): number {
  let hash = 0;
  const key = `${tourId}:${date}`;
  for (let i = 0; i < key.length; i++) hash = (hash * 33 + key.charCodeAt(i)) >>> 0;
  return hash % 5;
}

export function seatsLeft(
  tourId: string,
  date: string,
  holds: { tourId: string; date: string; people: number }[],
): number {
  const mine = holds
    .filter((hold) => hold.tourId === tourId && hold.date === date)
    .reduce((sum, hold) => sum + hold.people, 0);
  return Math.max(0, SEAT_CAPACITY - seedTaken(tourId, date) - mine);
}
