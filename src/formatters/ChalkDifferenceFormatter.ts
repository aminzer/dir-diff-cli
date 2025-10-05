import chalk from 'chalk';
import DifferenceFormatterInterface from './DifferenceFormatterInterface.js';

class ChalkDifferenceFormatter implements DifferenceFormatterInterface {
  public sourceOnly = (text: string | number): string => {
    return chalk.green(text);
  };

  public targetOnly = (text: string | number): string => {
    return chalk.red(text);
  };

  public different = (text: string | number): string => {
    return chalk.yellow(text);
  };
}
export default ChalkDifferenceFormatter;
