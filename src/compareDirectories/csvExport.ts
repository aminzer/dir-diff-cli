import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FsEntry } from '@aminzer/dir-diff';
import { DifferenceType } from '../constants';
import { DifferenceSet } from '../models';

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

export const getCsvExportFilePath = (): string => {
  const fileName = `dir-diff-export-${Date.now()}.csv`;

  return path.join(os.homedir(), fileName);
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

  fs.writeFileSync(outputFilePath, csvFileContent);
};
