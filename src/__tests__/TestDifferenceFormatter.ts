import { DifferenceFormatterInterface } from '../formatters/index.js';

class ChalkDifferenceFormatter implements DifferenceFormatterInterface {
  public sourceOnly = (text: string | number): string => {
    return `<green>${text}</green>`;
  };

  public targetOnly = (text: string | number): string => {
    return `<red>${text}</red>`;
  };

  public different = (text: string | number): string => {
    return `<yellow>${text}</yellow>`;
  };
}
export default ChalkDifferenceFormatter;
