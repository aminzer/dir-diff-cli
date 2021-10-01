import { Commands, CompareDirectoriesArgsDefinition } from '../cmd';
import { padToSameWidth } from './utils';

const compareDirectoriesFormattedArgNames = padToSameWidth(
  CompareDirectoriesArgsDefinition.map(({ name, valueDescription }) => (
    valueDescription ? `${name}${valueDescription}` : name
  )),
);

const compareDirectoriesArgsDescription = CompareDirectoriesArgsDefinition
  .map(({ alias, description }, index) => {
    const formattedName = compareDirectoriesFormattedArgNames[index];

    return `  --${formattedName} (-${alias}) - ${description.toLowerCase()}`;
  }, '')
  .join('\n');

export default '\n'
  + 'Compare directories:\n'
  + `dir-diff ${Commands.COMPARE_DIRECTORIES} [args...]\n`
  + `${compareDirectoriesArgsDescription}\n`
  + '\n'
  + 'Get version:\n'
  + 'dir-diff version\n';
