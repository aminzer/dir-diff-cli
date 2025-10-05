interface DifferenceFormatterInterface {
  sourceOnly: (text: string | number) => string;

  targetOnly: (text: string | number) => string;

  different: (text: string | number) => string;
}

export default DifferenceFormatterInterface;
