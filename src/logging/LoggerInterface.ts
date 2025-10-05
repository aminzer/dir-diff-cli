interface LoggerInterface {
  log: (message: string) => void;

  logSingleLine: (message: string) => void;

  clearSingleLine: () => void;
}

export default LoggerInterface;
