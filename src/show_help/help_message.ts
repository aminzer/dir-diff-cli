import {
  Commands,
  CompareDirectoriesArgs,
  CompareDirectoriesArgAliases,
} from '../cmd';
import { getMaxLength, padRight } from './utils';

const maxArgLength = getMaxLength(Object.values(CompareDirectoriesArgs));

function padArg(arg: string): string {
  return padRight(arg, maxArgLength);
}

export default [
  `dir-diff ${Commands.COMPARE_DIRECTORIES} [args...]`,
  `  --${padArg(`${CompareDirectoriesArgs.SOURCE_DIR_PATH} <path>`)} (-${CompareDirectoriesArgAliases.SOURCE_DIR_PATH}) | path to the source directory`,
  `  --${padArg(`${CompareDirectoriesArgs.TARGET_DIR_PATH} <path>`)} (-${CompareDirectoriesArgAliases.TARGET_DIR_PATH}) | path to the target directory`,
  `  --${padArg(CompareDirectoriesArgs.SKIP_SOURCE_ONLY)} (-${CompareDirectoriesArgAliases.SKIP_SOURCE_ONLY}) | source-only files/directories are not considered`,
  `  --${padArg(CompareDirectoriesArgs.SKIP_TARGET_ONLY)} (-${CompareDirectoriesArgAliases.SKIP_TARGET_ONLY}) | target-only files/directories are not considered`,
  `  --${padArg(CompareDirectoriesArgs.SKIP_DIFFERENT)} (-${CompareDirectoriesArgAliases.SKIP_DIFFERENT}) | different files are not considered`,
  `  --${padArg(CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON)} (-${CompareDirectoriesArgAliases.SKIP_CONTENT_COMPARISON}) | content comparison is skipped, files are compared by size only`,
  `  --${padArg(CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS)} (-${CompareDirectoriesArgAliases.SKIP_EXCESS_NESTED_ITERATIONS}) | children of source-only and target-only directories are not considered`,
].join('\n');
