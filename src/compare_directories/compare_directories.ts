import { compareDirectories as compareDirectoriesUtil, FsEntry } from '@aminzer/dir-diff';
import { CompareDirectoriesArgs } from '../cmd';
import { log } from '../logging';
import logCmdArgs from './log_cmd_args';
import ComparisonProgress from './comparison_progress';
import DifferenceSet from './difference_set';
import DifferenceType from './difference_type';

function logFsEntry(fsEntry, prefix) {
  const entryType = fsEntry.isDirectory ? 'dir ' : 'file';
  const entryPath = fsEntry.relativePath;

  log(`${prefix} | ${entryType} | ${entryPath}`);
}

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
  const differenceSet = new DifferenceSet();

  const dirDiffOpts = {
    onSourceOnlyEntry: args[CompareDirectoriesArgs.SKIP_SOURCE_ONLY] ? null : (fsEntry: FsEntry) => { // eslint-disable-line max-len
      differenceSet.add(fsEntry, DifferenceType.SOURCE_ONLY);
      comparisonProgress.considerFoundEntry(fsEntry, 'added');
    },
    onTargetOnlyEntry: args[CompareDirectoriesArgs.SKIP_TARGET_ONLY] ? null : (fsEntry: FsEntry) => { // eslint-disable-line max-len
      differenceSet.add(fsEntry, DifferenceType.TARGET_ONLY);
      comparisonProgress.considerFoundEntry(fsEntry, 'removed');
    },
    onDifferentEntries: args[CompareDirectoriesArgs.SKIP_DIFFERENT] ? null : (fsEntry: FsEntry) => { // eslint-disable-line max-len
      differenceSet.add(fsEntry, DifferenceType.DIFFERENT);
      comparisonProgress.considerFoundEntry(fsEntry, 'modified');
    },
    onEachEntry: (fsEntry: FsEntry) => {
      comparisonProgress.considerProcessingEntry(fsEntry);
    },
    skipContentComparison: args[CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON] || false,
    skipExcessNestedIterations: args[CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS] || false,
  };

  comparisonProgress.startLogging();

  await compareDirectoriesUtil(sourceDirPath, targetDirPath, dirDiffOpts);

  comparisonProgress.finishLogging();
  comparisonProgress.finish();
  comparisonProgress.log();
  log();
  log();

  if (differenceSet.isEmpty()) {
    log('Source and target directories have the same content.');
    return;
  }

  differenceSet.getAll(DifferenceType.SOURCE_ONLY).forEach((fsEntry) => logFsEntry(fsEntry, 'added   '));
  differenceSet.getAll(DifferenceType.TARGET_ONLY).forEach((fsEntry) => logFsEntry(fsEntry, 'modified'));
  differenceSet.getAll(DifferenceType.DIFFERENT).forEach((fsEntry) => logFsEntry(fsEntry, 'removed '));
}
