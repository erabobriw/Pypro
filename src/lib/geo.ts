export function routeKm(route: [number, number][]): number {
  let km = 0;
  for (let i = 1; i < route.length; i++) {
    km += haversine(route[i - 1], route[i]);
  }
  return Math.round(km);
}

function haversine(a: [number, number], b: [number, number]): number {
  const r = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}
