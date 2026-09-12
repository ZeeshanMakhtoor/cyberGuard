/** Formats a raw INR amount as the compact Lakh/Crore strings used throughout the UI (e.g. 4200000 -> "₹42L"). */
export function formatInrCompact(amount: number): string {
  if (amount >= 1_00_00_000) {
    const crore = amount / 1_00_00_000;
    return `₹${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)}Cr`;
  }
  if (amount >= 1_00_000) {
    const lakh = amount / 1_00_000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
