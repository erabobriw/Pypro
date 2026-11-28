export const FEE_RATE = 0.12;
export const FEE_MIN = 0.1;
export const FEE_MAX = 0.15;

export function quote(priceKzt: number, people: number) {
  const pay = priceKzt * people;
  const fee = Math.round(pay * FEE_RATE);
  return { pay, fee, payout: pay - fee };
}

export function formatKzt(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${sign}${grouped} ₸`;
}
