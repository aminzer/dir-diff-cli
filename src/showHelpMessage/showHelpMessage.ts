import { log } from '../logging';
import helpMessage from './helpMessage';

const showHelpMessage = (): void => {
  log(helpMessage);
};

export default showHelpMessage;
