import { CompareDirectoriesArgs } from '../cmd';
import { log } from '../logging';

export default function logCmdArgs(args: object) {
  log(`Source directory: "${args[CompareDirectoriesArgs.SOURCE_DIR_PATH]}"`);
  log(`Target directory: "${args[CompareDirectoriesArgs.TARGET_DIR_PATH]}"`);

  if (args[CompareDirectoriesArgs.SKIP_SOURCE_ONLY]) {
    log(`! Source-only files/directories are not considered (--${CompareDirectoriesArgs.SKIP_SOURCE_ONLY})`);
  }

  if (args[CompareDirectoriesArgs.SKIP_TARGET_ONLY]) {
    log(`! Target-only files/directories are not considered (--${CompareDirectoriesArgs.SKIP_TARGET_ONLY})`);
  }

  if (args[CompareDirectoriesArgs.SKIP_DIFFERENT]) {
    log(`! Different files are not considered (--${CompareDirectoriesArgs.SKIP_DIFFERENT})`);
  }

  if (args[CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON]) {
    log(`! Content comparison is skipped, files are compared by size only (--${CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON})`);
  }

  if (args[CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS]) {
    log(`! Children of source-only and target-only directories are not considered (--${CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS})`);
  }
}
