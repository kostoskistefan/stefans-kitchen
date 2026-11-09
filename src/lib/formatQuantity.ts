export function formatQuantity(quantity: number): string {
  return String(Math.round(quantity * 100) / 100);
}
