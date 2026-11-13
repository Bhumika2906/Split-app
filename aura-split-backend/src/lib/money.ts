// All money is integer paise. Never use floats for balances.
export const rupeesToPaise = (rupees: number): number =>
  Math.round(rupees * 100);

export const paiseToRupees = (paise: number): number => paise / 100;

// Split `total` paise among `n` people with no lost paise.
// Example: 10000 / 3 -> [3334, 3333, 3333]
export function splitEqually(total: number, n: number): number[] {
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}
