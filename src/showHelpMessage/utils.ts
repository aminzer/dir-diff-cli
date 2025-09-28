const getMaxLength = (strings: string[]): number => {
  const stringLengths = strings.map((str) => str.length);

  return Math.max(...stringLengths);
};

export const padToSameWidth = (strings: string[]): string[] => {
  const maxLength = getMaxLength(strings);

  return strings.map((str) => str.padEnd(maxLength, ' '));
};
