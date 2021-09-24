import { logSingleLine } from './logging';

class ComparisonProgress {
  processedFileCount: number = 0;

  processedDirCount: number = 0;

  addedFileCount: number = 0;

  addedDirCount: number = 0;

  modifiedFileCount: number = 0;

  removedFileCount: number = 0;

  removedDirCount: number = 0;

  loggingIntervalId: any = null;

  processingEntry: any = null;

  isFinished: boolean = false;

  considerProcessingEntry(fsEntry) {
    this.increaseProcessedEntriesCount();
    this.processingEntry = fsEntry;
  }

  considerFoundEntry(fsEntry, type) {
    this[`${type}${fsEntry.isFile ? 'File' : 'Dir'}Count`] += 1;
  }

  finish() {
    this.increaseProcessedEntriesCount();
    this.processingEntry = null;
    this.isFinished = true;
  }

  startLogging() {
    this.loggingIntervalId = setInterval(this.log.bind(this), 200);
  }

  finishLogging() {
    clearInterval(this.loggingIntervalId);
    this.loggingIntervalId = null;
  }

  log() {
    logSingleLine(this.status);
  }

  increaseProcessedEntriesCount() {
    if (!this.processingEntry) {
      return;
    }

    if (this.processingEntry.isFile) {
      this.processedFileCount += 1;
    } else {
      this.processedDirCount += 1;
    }
  }

  get status() {
    return this.comparisonProcessStatus
      + this.processedStatus
      + this.comparisonStatus
      + this.processingStatus;
  }

  get comparisonProcessStatus() {
    return this.isFinished ? 'Comparison process is finished.' : 'Comparison process is in progress:';
  }

  get processedStatus() {
    return `\nProcessed: ${this.processedFileCount} files, ${this.processedDirCount} directories.`;
  }

  get comparisonStatus() {
    const {
      addedFileCount, addedDirCount, modifiedFileCount, removedFileCount, removedDirCount,
    } = this;

    const foundEntries = [];

    if (addedFileCount > 0) {
      foundEntries.push(`${addedFileCount} added files`);
    }

    if (addedDirCount > 0) {
      foundEntries.push(`${addedDirCount} added dirs`);
    }

    if (modifiedFileCount > 0) {
      foundEntries.push(`${modifiedFileCount} modified files`);
    }

    if (removedFileCount > 0) {
      foundEntries.push(`${removedFileCount} removed files`);
    }

    if (removedDirCount > 0) {
      foundEntries.push(`${removedDirCount} removed dirs`);
    }

    if (foundEntries.length === 0) {
      return '';
    }

    return `\nFound: ${foundEntries.join(', ')}.`;
  }

  get processingStatus() {
    return this.processingEntry ? `\nProcessing: "${this.processingEntry.absolutePath}"` : '';
  }
}

export default ComparisonProgress;
