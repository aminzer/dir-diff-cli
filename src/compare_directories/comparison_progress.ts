/* eslint-disable class-methods-use-this */

import { FsEntry } from '@aminzer/dir-diff';
import * as colors from '../colors';
import { log, logSingleLine, clearSingleLine } from '../logging';
import DifferenceType from './difference_type';
import DifferenceSet from './difference_set';

export default class ComparisonProgress {
  private statistic: {
    processedFileCount: number;
    processedDirCount: number;
    sourceOnlyFileCount: number;
    sourceOnlyDirCount: number;
    targetOnlyFileCount: number;
    targetOnlyDirCount: number;
    differentFileCount: number;
  } = {
    processedFileCount: 0,
    processedDirCount: 0,
    sourceOnlyFileCount: 0,
    sourceOnlyDirCount: 0,
    targetOnlyFileCount: 0,
    targetOnlyDirCount: 0,
    differentFileCount: 0,
  };

  private differenceSet: DifferenceSet = new DifferenceSet();

  private inProgress: boolean;

  private statusLoggingIntervalId: any;

  private statusLoggingDelay: number = 200;

  private processingFsEntry: FsEntry;

  start(): void {
    this.inProgress = true;
    this.startStatusLogging();
  }

  finish({ clearStatus = false } = {}): void {
    this.inProgress = false;
    this.finishStatusLogging();

    if (clearStatus) {
      this.clearStatus();
    } else {
      this.logStatus();
    }
  }

  considerFsEntry(fsEntry: FsEntry, differenceType?: DifferenceType): void {
    this.processingFsEntry = fsEntry;

    const statisticKey = this.getStatisticKey(fsEntry, differenceType);
    this.statistic[statisticKey] += 1;

    if (differenceType) {
      this.differenceSet.add(fsEntry, differenceType);
    }
  }

  areDirectoriesEqual(): boolean {
    return this.differenceSet.isEmpty();
  }

  logDifferenceSet(): void {
    [
      DifferenceType.SOURCE_ONLY,
      DifferenceType.DIFFERENT,
      DifferenceType.TARGET_ONLY,
    ].forEach((differenceType) => {
      this.differenceSet.getAll(differenceType).forEach((fsEntry) => {
        this.logFsEntry(fsEntry, differenceType);
      });
    });
  }

  private startStatusLogging(): void {
    this.statusLoggingIntervalId = setInterval(this.logStatus.bind(this), this.statusLoggingDelay);
  }

  private finishStatusLogging(): void {
    clearInterval(this.statusLoggingIntervalId);
  }

  private getStatisticKey(fsEntry: FsEntry, differenceType: DifferenceType): string {
    switch (differenceType) {
      case DifferenceType.SOURCE_ONLY:
        return fsEntry.isFile ? 'sourceOnlyFileCount' : 'sourceOnlyDirCount';

      case DifferenceType.TARGET_ONLY:
        return fsEntry.isFile ? 'targetOnlyFileCount' : 'targetOnlyDirCount';

      case DifferenceType.DIFFERENT:
        return 'differentFileCount';

      default:
        return fsEntry.isFile ? 'processedFileCount' : 'processedDirCount';
    }
  }

  private logStatus(): void {
    logSingleLine(this.status);
  }

  private clearStatus(): void {
    clearSingleLine();
  }

  private get status(): string {
    return this.comparisonProcessStatus
      + this.processedStatus
      + this.comparisonStatus
      + this.processingStatus;
  }

  private get comparisonProcessStatus(): string {
    return this.inProgress ? 'Comparison is in progress:' : 'Comparison is finished.';
  }

  private get processedStatus(): string {
    const { processedFileCount, processedDirCount } = this.statistic;

    return `\nProcessed: ${processedFileCount} files, ${processedDirCount} directories.`;
  }

  private get comparisonStatus(): string {
    const {
      sourceOnlyFileCount,
      sourceOnlyDirCount,
      targetOnlyFileCount,
      targetOnlyDirCount,
      differentFileCount,
    } = this.statistic;

    const foundEntries = [];

    if (sourceOnlyFileCount > 0) {
      foundEntries.push(`${colors.sourceOnly(sourceOnlyFileCount)} source-only files`);
    }

    if (sourceOnlyDirCount > 0) {
      foundEntries.push(`${colors.sourceOnly(sourceOnlyDirCount)} source-only dirs`);
    }

    if (differentFileCount > 0) {
      foundEntries.push(`${colors.different(differentFileCount)} different files`);
    }

    if (targetOnlyFileCount > 0) {
      foundEntries.push(`${colors.targetOnly(targetOnlyFileCount)} target-only files`);
    }

    if (targetOnlyDirCount > 0) {
      foundEntries.push(`${colors.targetOnly(targetOnlyDirCount)} target-only dirs`);
    }

    if (foundEntries.length === 0) {
      return '';
    }

    return `\nFound: ${foundEntries.join(', ')}.`;
  }

  private get processingStatus(): string {
    return this.inProgress && this.processingFsEntry ? `\nProcessing: "${this.processingFsEntry.absolutePath}"` : '';
  }

  private logFsEntry(fsEntry: FsEntry, differenceType: DifferenceType): void {
    const formattedDifferenceType = this.formatDifferenceType(differenceType);
    const entryType = this.formatFsEntryType(fsEntry);
    const entryPath = fsEntry.relativePath;

    log(`${formattedDifferenceType} | ${entryType} | ${entryPath}`);
  }

  private formatDifferenceType(differenceType: DifferenceType) :string {
    switch (differenceType) {
      case DifferenceType.SOURCE_ONLY:
        return colors.sourceOnly('source-only');

      case DifferenceType.TARGET_ONLY:
        return colors.targetOnly('target-only');

      case DifferenceType.DIFFERENT:
        return colors.different('different  ');

      default:
        return '';
    }
  }

  private formatFsEntryType(fsEntry : FsEntry): string {
    return fsEntry.isDirectory ? 'dir' : '   ';
  }
}
