const { logSingleLine } = require('./logging');

class ComparisonProgress {
  constructor() {
    this._processedFileCount = 0;
    this._processedDirCount = 0;
    this._addedFileCount = 0;
    this._addedDirCount = 0;
    this._modifiedFileCount = 0;
    this._removedFileCount = 0;
    this._removedDirCount = 0;

    this._loggingIntervalId = null;
    this._processingEntry = null;
    this._isFinished = false;
  }

  considerProcessingEntry(fsEntry) {
    this._increaseProcessedEntriesCount();
    this._processingEntry = fsEntry;
  }

  considerFoundEntry(fsEntry, type) {
    this[`_${type}${fsEntry.isFile ? 'File' : 'Dir'}Count`]++;
  }

  finish() {
    this._increaseProcessedEntriesCount();
    this._processingEntry = null;
    this._isFinished = true;
  }

  startLogging() {
    this._loggingIntervalId = setInterval(this.log.bind(this), 200);
  }

  finishLogging() {
    clearInterval(this._loggingIntervalId);
    this._loggingIntervalId = null;
  }

  log() {
    logSingleLine(this._status);
  }

  _increaseProcessedEntriesCount() {
    if (!this._processingEntry) {
      return;
    }

    if (this._processingEntry.isFile) {
      this._processedFileCount++;

    } else {
      this._processedDirCount++;
    }
  }

  get _status() {
    return this._comparisonProcessStatus + this._processedStatus + this._comparisonStatus + this._processingStatus;
  }

  get _comparisonProcessStatus() {
    return this._isFinished ? 'Comparison process is finished.' : 'Comparison process is in progress:';
  }

  get _processedStatus() {
    return `\nProcessed: ${this._processedFileCount} files, ${this._processedDirCount} directories.`;
  }

  get _comparisonStatus() {
    const { _addedFileCount, _addedDirCount, _modifiedFileCount, _removedFileCount, _removedDirCount } = this;

    const foundEntries = [];

    if (_addedFileCount > 0) {
      foundEntries.push(`${_addedFileCount} added files`);
    }

    if (_addedDirCount > 0) {
      foundEntries.push(`${_addedDirCount} added dirs`);
    }

    if (_modifiedFileCount > 0) {
      foundEntries.push(`${_modifiedFileCount} modified files`);
    }

    if (_removedFileCount > 0) {
      foundEntries.push(`${_removedFileCount} removed files`);
    }

    if (_removedDirCount > 0) {
      foundEntries.push(`${_removedDirCount} removed dirs`);
    }

    if (foundEntries.length === 0) {
      return '';
    }

    return `\nFound: ${foundEntries.join(', ')}.`;
  }

  get _processingStatus() {
    return this._processingEntry ? `\nProcessing: "${this._processingEntry.absolutePath}"` : '';
  }
}

module.exports = ComparisonProgress;
