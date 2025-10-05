import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { FsEntry } from '@aminzer/dir-diff';
import { DifferenceType } from '../constants/index.js';
import { DifferenceSet } from '../models/index.js';

const formatCsvCell = (cellValue: string): string => `"${cellValue.replace(/"/g, '""')}"`;

const formatCsvRow = (cellValues: string[]): string =>
  `${cellValues.map(formatCsvCell).join(',')}\n`;

const formatDifferenceType = (differenceType: DifferenceType): string => {
  switch (differenceType) {
    case DifferenceType.SOURCE_ONLY:
      return 'source-only';

    case DifferenceType.TARGET_ONLY:
      return 'target-only';

    case DifferenceType.DIFFERENT:
      return 'different';

    default:
      return '';
  }
};

const formatFsEntryType = (fsEntry: FsEntry): string => (fsEntry.isDirectory ? 'dir' : 'file');

const formatDate = (date: Date): string => {
  const pad = (n: number, width = 2) => n.toString().padStart(width, '0');

  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    '_' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds()) +
    pad(date.getMilliseconds(), 3)
  );
};

export const getCsvExportFilePath = (): string => {
  const currentDate = new Date(Date.now());

  const fileName = `dir_diff_export_${formatDate(currentDate)}.csv`;

  return join(homedir(), fileName);
};

export const exportToCsv = (differenceSet: DifferenceSet, outputFilePath: string): void => {
  let csvFileContent = formatCsvRow([
    'Difference type',
    'Entry type',
    'Relative entry path',
    'Absolute entry path',
  ]);

  [DifferenceType.SOURCE_ONLY, DifferenceType.DIFFERENT, DifferenceType.TARGET_ONLY].forEach(
    (differenceType) => {
      differenceSet.getAll(differenceType).forEach((fsEntry) => {
        csvFileContent += formatCsvRow([
          formatDifferenceType(differenceType),
          formatFsEntryType(fsEntry),
          fsEntry.relativePath,
          fsEntry.absolutePath,
        ]);
      });
    },
  );

  writeFileSync(outputFilePath, csvFileContent);
};
