import { log } from '../logging/index.js';
import helpMessage from './helpMessage.js';

const showHelpMessage = (): void => {
  log(helpMessage);
};

export default showHelpMessage;
