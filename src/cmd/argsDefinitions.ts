import { OptionDefinition } from 'command-line-args';
import { CompareDirectoriesArgs } from './constants';

export const CommandArgDefinition: OptionDefinition[] = [
  {
    name: 'command',
    defaultOption: true,
  },
];

export const CompareDirectoriesArgsDefinition: (OptionDefinition & {
  description: string;
  valueDescription?: string;
})[] = [
  {
    name: CompareDirectoriesArgs.SOURCE_DIR_PATH,
    alias: 's',
    type: String,
    description: 'Path to the source directory',
    valueDescription: ' <path>',
  },
  {
    name: CompareDirectoriesArgs.TARGET_DIR_PATH,
    alias: 't',
    type: String,
    description: 'Path to the target directory',
    valueDescription: ' <path>',
  },
  {
    name: CompareDirectoriesArgs.SKIP_SOURCE_ONLY,
    alias: 'S',
    type: Boolean,
    description: 'Source-only files/directories are not considered',
  },
  {
    name: CompareDirectoriesArgs.SKIP_TARGET_ONLY,
    alias: 'T',
    type: Boolean,
    description: 'Target-only files/directories are not considered',
  },
  {
    name: CompareDirectoriesArgs.SKIP_DIFFERENT,
    alias: 'D',
    type: Boolean,
    description: 'Different files are not considered',
  },
  {
    name: CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON,
    alias: 'C',
    type: Boolean,
    description: 'Content comparison is skipped, files are compared by size only',
  },
  {
    name: CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS,
    alias: 'X',
    type: Boolean,
    description: 'Children of source-only and target-only directories are not considered',
  },
  {
    name: CompareDirectoriesArgs.LOG_DIFFERENCE_SET_TO_CSV,
    type: Boolean,
    description: 'Directory difference is logged into CSV file',
  },
];
