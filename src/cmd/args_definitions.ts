import {
  CompareDirectoriesArgs,
  CompareDirectoriesArgAliases,
} from './constants';

export const CommandDefinition = [{
  name: 'command',
  defaultOption: true,
}];

export const CompareDirectoriesDefinition = [{
  name: CompareDirectoriesArgs.SOURCE_DIR_PATH,
  alias: CompareDirectoriesArgAliases.SOURCE_DIR_PATH,
  type: String,
}, {
  name: CompareDirectoriesArgs.TARGET_DIR_PATH,
  alias: CompareDirectoriesArgAliases.TARGET_DIR_PATH,
  type: String,
}, {
  name: CompareDirectoriesArgs.SKIP_SOURCE_ONLY,
  alias: CompareDirectoriesArgAliases.SKIP_SOURCE_ONLY,
  type: Boolean,
}, {
  name: CompareDirectoriesArgs.SKIP_TARGET_ONLY,
  alias: CompareDirectoriesArgAliases.SKIP_TARGET_ONLY,
  type: Boolean,
}, {
  name: CompareDirectoriesArgs.SKIP_DIFFERENT,
  alias: CompareDirectoriesArgAliases.SKIP_DIFFERENT,
  type: Boolean,
}, {
  name: CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON,
  alias: CompareDirectoriesArgAliases.SKIP_CONTENT_COMPARISON,
  type: Boolean,
}, {
  name: CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS,
  alias: CompareDirectoriesArgAliases.SKIP_EXCESS_NESTED_ITERATIONS,
  type: Boolean,
}];
