import { log } from '../logging';
import helpMessage from './help_message';

export default function showHelpMessage(): void {
  log(helpMessage);
}
