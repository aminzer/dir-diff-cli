import { stdout } from 'single-line-log';
import LoggerInterface from './LoggerInterface.js';

class StdoutLogger implements LoggerInterface {
  public log(message: string): void {
    process.stdout.write(`${message}\n`);
  }

  public logSingleLine(message: string): void {
    stdout(message);
  }

  public clearSingleLine(): void {
    stdout.clear();
  }
}

export default StdoutLogger;
