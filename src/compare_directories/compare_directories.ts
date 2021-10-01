import { compareDirectories as compareDirectoriesUtil, FsEntry } from '@aminzer/dir-diff';
import { CompareDirectoriesArgs, CmdArgs } from '../cmd';
import { log } from '../logging';
import logCmdArgs from './log_cmd_args';
import ComparisonProgress from './comparison_progress';
import DifferenceType from './difference_type';

const {
  SOURCE_DIR_PATH,
  TARGET_DIR_PATH,
  SKIP_SOURCE_ONLY,
  SKIP_TARGET_ONLY,
  SKIP_DIFFERENT,
  SKIP_CONTENT_COMPARISON,
  SKIP_EXCESS_NESTED_ITERATIONS,
} = CompareDirectoriesArgs;

export default async function compareDirectories(args: CmdArgs): Promise<void> {
  const sourceDirPath = args[SOURCE_DIR_PATH] as string;
  const targetDirPath = args[TARGET_DIR_PATH] as string;
  const skipSourceOnly = args[SKIP_SOURCE_ONLY] as boolean;
  const skipTargetOnly = args[SKIP_TARGET_ONLY] as boolean;
  const skipDifferent = args[SKIP_DIFFERENT] as boolean;
  const skipContentComparison = args[SKIP_CONTENT_COMPARISON] as boolean;
  const skipExcessNestedIterations = args[SKIP_EXCESS_NESTED_ITERATIONS] as boolean;

  if (!sourceDirPath) {
    throw new Error(`Source directory is not set: [--${SOURCE_DIR_PATH} <path>]`);
  }

  if (!targetDirPath) {
    throw new Error(`Target directory is not set: [--${TARGET_DIR_PATH} <path>]`);
  }

  logCmdArgs(args);
  log();

  const comparisonProgress = new ComparisonProgress();

  const compareDirectoriesOpts = {
    onSourceOnlyEntry: skipSourceOnly ? null : (fsEntry: FsEntry) => {
      comparisonProgress.considerFsEntry(fsEntry, DifferenceType.SOURCE_ONLY);
    },
    onTargetOnlyEntry: skipTargetOnly ? null : (fsEntry: FsEntry) => {
      comparisonProgress.considerFsEntry(fsEntry, DifferenceType.TARGET_ONLY);
    },
    onDifferentEntries: skipDifferent ? null : (fsEntry: FsEntry) => {
      comparisonProgress.considerFsEntry(fsEntry, DifferenceType.DIFFERENT);
    },
    onEachEntry: (fsEntry: FsEntry) => {
      comparisonProgress.considerFsEntry(fsEntry);
    },
    skipContentComparison: skipContentComparison || false,
    skipExcessNestedIterations: skipExcessNestedIterations || false,
  };

  comparisonProgress.start();

  try {
    await compareDirectoriesUtil(sourceDirPath, targetDirPath, compareDirectoriesOpts);
  } catch (err) {
    comparisonProgress.finish({ clearStatus: true });
    throw err;
  }

  comparisonProgress.finish();

  log();
  log();

  if (comparisonProgress.areDirectoriesEqual()) {
    log('Source and target directories have the same content.');
  } else {
    comparisonProgress.logDifferenceSet();
  }
}
