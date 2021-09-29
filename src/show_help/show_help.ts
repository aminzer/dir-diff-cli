import { log } from '../logging';
import helpMessage from './help_message';

export default function showHelp(): void {
  log(helpMessage);
}
