export function clamp(min: number, n: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
