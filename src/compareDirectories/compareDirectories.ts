import { compareDirectories as compareDirectoriesUtil, FsEntry } from '@aminzer/dir-diff';
import { CompareDirectoriesArgs, CmdArgs } from '../cmd/index.js';
import { DifferenceType } from '../constants/index.js';
import { LoggerInterface } from '../logging/index.js';
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

const compareDirectories = async ({
  cmdArgs,
  logger,
}: {
  cmdArgs: CmdArgs;
  logger: LoggerInterface;
}): Promise<void> => {
  const sourceDirPath = cmdArgs[SOURCE_DIR_PATH] as string;
  const targetDirPath = cmdArgs[TARGET_DIR_PATH] as string;
  const skipSourceOnly = cmdArgs[SKIP_SOURCE_ONLY] as boolean;
  const skipTargetOnly = cmdArgs[SKIP_TARGET_ONLY] as boolean;
  const skipDifferent = cmdArgs[SKIP_DIFFERENT] as boolean;
  const skipContentComparison = cmdArgs[SKIP_CONTENT_COMPARISON] as boolean;
  const skipExcessNestedIterations = cmdArgs[SKIP_EXCESS_NESTED_ITERATIONS] as boolean;
  const logDifferenceSetToCsv = cmdArgs[LOG_DIFFERENCE_SET_TO_CSV] as boolean;

  if (!sourceDirPath) {
    throw new Error(`Source directory is not set: [--${SOURCE_DIR_PATH} <path>]`);
  }

  if (!targetDirPath) {
    throw new Error(`Target directory is not set: [--${TARGET_DIR_PATH} <path>]`);
  }

  logCmdArgs({ cmdArgs, logger });
  logger.log('');

  const comparisonProgress = new ComparisonProgress({ logger });

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

  logger.log('');
  logger.log('');

  if (comparisonProgress.areDirectoriesEqual()) {
    logger.log('Source and target directories have the same content.');
    return;
  }

  comparisonProgress.logDifferenceSet();

  if (logDifferenceSetToCsv) {
    const csvFilePath = getCsvExportFilePath();

    exportToCsv(comparisonProgress.getDifferenceSet(), csvFilePath);

    logger.log('');
    logger.log(`Directory difference is exported to: "${csvFilePath}"`);
  }
};

export default compareDirectories;
