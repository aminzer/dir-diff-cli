function getMaxLength(strings: string[]): number {
  const stringLengths = strings.map((str) => str.length);

  return Math.max(...stringLengths);
}

// eslint-disable-next-line import/prefer-default-export
export function padToSameWidth(strings: string[]): string[] {
  const maxLength = getMaxLength(strings);

  return strings.map((str) => str.padEnd(maxLength, ' '));
}
