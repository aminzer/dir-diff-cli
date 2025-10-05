import { LoggerInterface } from '../logging/index.js';
import helpMessage from './helpMessage.js';

const showHelpMessage = ({ logger }: { logger: LoggerInterface }): void => {
  logger.log(helpMessage);
};

export default showHelpMessage;
