import { Commands, CompareDirectoriesArgsDefinition } from '../cmd';
import { padToSameWidth } from './utils';

const formattedArgNames = padToSameWidth(
  CompareDirectoriesArgsDefinition.map(({ name, valueDescription }) => (
    valueDescription ? `${name}${valueDescription}` : name
  )),
);

const helpMessageLines = [
  `dir-diff ${Commands.COMPARE_DIRECTORIES} [args...]`,
];

CompareDirectoriesArgsDefinition.forEach(({ alias, description }, index) => {
  const formattedName = formattedArgNames[index];

  helpMessageLines.push(`  --${formattedName} (-${alias}) - ${description.toLowerCase()}`);
});

export default helpMessageLines.join('\n');
