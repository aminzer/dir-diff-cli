#!/usr/bin/env node

import { compareDirectories } from '@aminzer/dir-diff';
import { log } from './logging';
import parseCmdArgs from './parse_cmd_args';
import logCmdArgs from './log_cmd_args';
import helpMessage from './help_message';
import ComparisonProgress from './comparison_progress';

function logFsEntry(fsEntry, prefix) {
  const entryType = fsEntry.isDirectory ? 'dir ' : 'file';
  const entryPath = fsEntry.relativePath;

  log(`${prefix} | ${entryType} | ${entryPath}`);
}

(async () => {
  try {
    const args = parseCmdArgs();

    if (args.help) {
      log(helpMessage);
      return;
    }

    const sourceDir = args.source;
    if (!sourceDir) {
      throw new Error('Source directory is not set. [ --source <path> ]');
    }

    const targetDir = args.target;
    if (!targetDir) {
      throw new Error('Target directory is not set. [ --target <path> ]');
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
      onSourceOnlyEntry: args['skip-added'] ? null : (fsEntry) => {
        diff.added.push(fsEntry);
        comparisonProgress.considerFoundEntry(fsEntry, 'added');
      },
      onDifferentEntries: args['skip-modified'] ? null : (fsEntry) => {
        diff.modified.push(fsEntry);
        comparisonProgress.considerFoundEntry(fsEntry, 'modified');
      },
      onTargetOnlyEntry: args['skip-removed'] ? null : (fsEntry) => {
        diff.removed.push(fsEntry);
        comparisonProgress.considerFoundEntry(fsEntry, 'removed');
      },
      onEachEntry: (fsEntry) => {
        comparisonProgress.considerProcessingEntry(fsEntry);
      },
      skipContentComparison: args['skip-content-comparison'] || false,
      skipExcessNestedIterations: args['skip-extra-iterations'] || false,
    };

    comparisonProgress.startLogging();

    await compareDirectories(sourceDir, targetDir, dirDiffOpts);

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
  } catch (err) {
    log();
    log('Error occurred!');
    log(err.stack);
    log('Use [ --help ] option to see available arguments.');
  }
})();
