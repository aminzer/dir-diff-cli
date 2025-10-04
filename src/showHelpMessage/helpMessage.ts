import { Commands, CompareDirectoriesArgsDefinition } from '../cmd/index.js';
import { padToSameWidth } from './utils.js';

const compareDirectoriesFormattedArgNames = padToSameWidth(
  CompareDirectoriesArgsDefinition.map(({ name, valueDescription }) =>
    valueDescription ? `--${name}${valueDescription}` : `--${name}`,
  ),
);

const compareDirectoriesFormattedArgAliases = padToSameWidth(
  CompareDirectoriesArgsDefinition.map(({ alias }) => (alias ? `(-${alias})` : '')),
);

const compareDirectoriesArgsDescription = CompareDirectoriesArgsDefinition.map(
  ({ description }, index) => {
    const formattedName = compareDirectoriesFormattedArgNames[index];
    const formattedAlias = compareDirectoriesFormattedArgAliases[index];

    return `  ${formattedName} ${formattedAlias} - ${(description ?? '').toLowerCase()}`;
  },
  '',
).join('\n');

export default '\n' +
  'Compare directories:\n' +
  `dir-diff ${Commands.COMPARE_DIRECTORIES} [args...]\n` +
  `${compareDirectoriesArgsDescription}\n` +
  '\n' +
  'Get version:\n' +
  'dir-diff version\n';
