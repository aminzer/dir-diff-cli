import { LoggerInterface } from '../logging/index.js';

class TestLogger implements LoggerInterface {
  private _messages: string[] = [];
  private _singleLineMessages: string[] = [];

  public log(message: string): void {
    this._messages.push(message);
  }

  public logSingleLine(message: string): void {
    this._singleLineMessages.push(message);
  }

  public clearSingleLine(): void {
    // Ignored to be able to test single line messages
  }

  public getMessages(): string[] {
    return this._messages;
  }

  public getSingleLineMessages(): string[] {
    return this._singleLineMessages;
  }

  public reset(): void {
    this._messages = [];
    this._singleLineMessages = [];
  }
}

export default TestLogger;
