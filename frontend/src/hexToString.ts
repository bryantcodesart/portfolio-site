export function hexToString(hex: number) {
  return `#${(hex).toString(16).padStart(6, '0')}`;
}
