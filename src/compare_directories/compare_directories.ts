import { compareDirectories as compareDirectories1 } from '@aminzer/dir-diff';
import { CompareDirectoriesArgs } from '../cmd';
import { log } from '../logging';
import logCmdArgs from './log_cmd_args';
import ComparisonProgress from './comparison_progress';

function logFsEntry(fsEntry, prefix) {
  const entryType = fsEntry.isDirectory ? 'dir ' : 'file';
  const entryPath = fsEntry.relativePath;

  log(`${prefix} | ${entryType} | ${entryPath}`);
}

export default async function compareDirectories(args: object): Promise<void> {
  const sourceDirPath = args[CompareDirectoriesArgs.SOURCE_DIR_PATH];
  if (!sourceDirPath) {
    throw new Error(`Source directory is not set. [ --${CompareDirectoriesArgs.SOURCE_DIR_PATH} <path> ]`);
  }

  const targetDirPath = args[CompareDirectoriesArgs.TARGET_DIR_PATH];
  if (!targetDirPath) {
    throw new Error(`Target directory is not set. [ --${CompareDirectoriesArgs.TARGET_DIR_PATH} <path> ]`);
  }

  logCmdArgs(args);
  log();

  const comparisonProgress = new ComparisonProgress();
  const diff = {
    added: [],
    modified: [],
    removed: [],
  };

  const dirDiffOpts = {
    onSourceOnlyEntry: args[CompareDirectoriesArgs.SKIP_SOURCE_ONLY] ? null : (fsEntry) => {
      diff.added.push(fsEntry);
      comparisonProgress.considerFoundEntry(fsEntry, 'added');
    },
    onTargetOnlyEntry: args[CompareDirectoriesArgs.SKIP_TARGET_ONLY] ? null : (fsEntry) => {
      diff.removed.push(fsEntry);
      comparisonProgress.considerFoundEntry(fsEntry, 'removed');
    },
    onDifferentEntries: args[CompareDirectoriesArgs.SKIP_DIFFERENT] ? null : (fsEntry) => {
      diff.modified.push(fsEntry);
      comparisonProgress.considerFoundEntry(fsEntry, 'modified');
    },
    onEachEntry: (fsEntry) => {
      comparisonProgress.considerProcessingEntry(fsEntry);
    },
    skipContentComparison: args[CompareDirectoriesArgs.SKIP_CONTENT_COMPARISON] || false,
    skipExcessNestedIterations: args[CompareDirectoriesArgs.SKIP_EXCESS_NESTED_ITERATIONS] || false,
  };

  comparisonProgress.startLogging();

  await compareDirectories1(sourceDirPath, targetDirPath, dirDiffOpts);

  comparisonProgress.finishLogging();
  comparisonProgress.finish();
  comparisonProgress.log();
  log();
  log();

  if (diff.added.length === 0 && diff.modified.length === 0 && diff.removed.length === 0) {
    log('Source and target directories have the same content.');
    return;
  }

  diff.added.forEach((fsEntry) => logFsEntry(fsEntry, 'added   '));
  diff.modified.forEach((fsEntry) => logFsEntry(fsEntry, 'modified'));
  diff.removed.forEach((fsEntry) => logFsEntry(fsEntry, 'removed '));
}
