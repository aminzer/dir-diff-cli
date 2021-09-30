import { compareDirectories as compareDirectoriesUtil, FsEntry } from '@aminzer/dir-diff';
import { CompareDirectoriesArgs } from '../cmd';
import { log } from '../logging';
import logCmdArgs from './log_cmd_args';
import ComparisonProgress from './comparison_progress';
import DifferenceType from './difference_type';

export default async function compareDirectories(args: object): Promise<void> {
  const sourceDirPath = args[CompareDirectoriesArgs.SOURCE_DIR_PATH];
  if (!sourceDirPath) {
    throw new Error(`Source directory is not set: [--${CompareDirectoriesArgs.SOURCE_DIR_PATH} <path>]`);
  }

  const targetDirPath = args[CompareDirectoriesArgs.TARGET_DIR_PATH];
  if (!targetDirPath) {
    throw new Error(`Target directory is not set: [--${CompareDirectoriesArgs.TARGET_DIR_PATH} <path>]`);
  }

  logCmdArgs(args);
  log();

  const comparisonProgress = new ComparisonProgress();

  const compareDirectoriesOpts = {
    onSourceOnlyEntry: args[CompareDirectoriesArgs.SKIP_SOURCE_ONLY] ? null : (fsEntry: FsEntry) => { // eslint-disable-line max-len
      comparisonProgress.considerFsEntry(fsEntry, DifferenceType.SOURCE_ONLY);
    },
    onTargetOnlyEntry: args[CompareDirectoriesArgs.SKIP_TARGET_ONLY] ? null : (fsEntry: FsEntry) => { // eslint-disable-line max-len
      comparisonProgress.considerFsEntry(fsEntry, DifferenceType.TARGET_ONLY);
    },
    onDifferentEntries: args[CompareDirectoriesArgs.SKIP_DIFFERENT] ? null : (fsEntry: FsEntry) => { // eslint-disable-line max-len
      comparisonProgress.considerFsEntry(fsEntry, DifferenceType.DIFFERENT);
    },
    onEachEntry: (fsEntry: FsEntry) => {
      comparisonProgress.considerFsEntry(fsEntry);
    },
    skipContentComparison: args[CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON] || false,
    skipExcessNestedIterations: args[CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS] || false,
  };

  comparisonProgress.start();

  await compareDirectoriesUtil(sourceDirPath, targetDirPath, compareDirectoriesOpts);

  comparisonProgress.finish();

  log();
  log();

  if (comparisonProgress.areDirectoriesEqual()) {
    log('Source and target directories have the same content.');
    return;
  }

  comparisonProgress.logDifferenceSet();
}
