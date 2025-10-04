import { compareDirectories as compareDirectoriesUtil, FsEntry } from '@aminzer/dir-diff';
import { CompareDirectoriesArgs, CmdArgs } from '../cmd/index.js';
import { DifferenceType } from '../constants/index.js';
import { log } from '../logging/index.js';
import { ComparisonProgress } from '../models/index.js';
import { getCsvExportFilePath, exportToCsv } from './csvExport.js';
import logCmdArgs from './logCmdArgs.js';

const {
  SOURCE_DIR_PATH,
  TARGET_DIR_PATH,
  SKIP_SOURCE_ONLY,
  SKIP_TARGET_ONLY,
  SKIP_DIFFERENT,
  SKIP_CONTENT_COMPARISON,
  SKIP_EXCESS_NESTED_ITERATIONS,
  LOG_DIFFERENCE_SET_TO_CSV,
} = CompareDirectoriesArgs;

const compareDirectories = async (args: CmdArgs): Promise<void> => {
  const sourceDirPath = args[SOURCE_DIR_PATH] as string;
  const targetDirPath = args[TARGET_DIR_PATH] as string;
  const skipSourceOnly = args[SKIP_SOURCE_ONLY] as boolean;
  const skipTargetOnly = args[SKIP_TARGET_ONLY] as boolean;
  const skipDifferent = args[SKIP_DIFFERENT] as boolean;
  const skipContentComparison = args[SKIP_CONTENT_COMPARISON] as boolean;
  const skipExcessNestedIterations = args[SKIP_EXCESS_NESTED_ITERATIONS] as boolean;
  const logDifferenceSetToCsv = args[LOG_DIFFERENCE_SET_TO_CSV] as boolean;

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
    onSourceOnlyEntry: skipSourceOnly
      ? undefined
      : (fsEntry: FsEntry) => {
          comparisonProgress.considerFsEntry(fsEntry, DifferenceType.SOURCE_ONLY);
        },
    onTargetOnlyEntry: skipTargetOnly
      ? undefined
      : (fsEntry: FsEntry) => {
          comparisonProgress.considerFsEntry(fsEntry, DifferenceType.TARGET_ONLY);
        },
    onDifferentEntries: skipDifferent
      ? undefined
      : (fsEntry: FsEntry) => {
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
    return;
  }

  comparisonProgress.logDifferenceSet();

  if (logDifferenceSetToCsv) {
    const csvFilePath = getCsvExportFilePath();

    exportToCsv(comparisonProgress.getDifferenceSet(), csvFilePath);

    log();
    log(`Directory difference is exported to: "${csvFilePath}"`);
  }
};

export default compareDirectories;
