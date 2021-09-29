export function getMaxLength(strings: string[]): number {
  const stringLengths: number[] = strings.map((str) => str.length);

  return Math.max(...stringLengths);
}

export function padRight(str: string, length: number): string {
  return str.padEnd(length, ' ');
}
