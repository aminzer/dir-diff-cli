import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FsEntry } from '@aminzer/dir-diff';
import DifferenceType from './difference_type';
import DifferenceSet from './difference_set';

function formatCsvCell(cellValue: string): string {
  return `"${cellValue.replace(/"/g, '""')}"`;
}

function formatCsvRow(cellValues: string[]): string {
  return `${cellValues.map(formatCsvCell).join(',')}\n`;
}

function formatDifferenceType(differenceType: DifferenceType): string {
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
}

function formatFsEntryType(fsEntry: FsEntry): string {
  return fsEntry.isDirectory ? 'dir' : 'file';
}

export function getCsvExportFilePath(): string {
  const fileName = `dir-diff-export-${Date.now()}.csv`;

  return path.join(os.homedir(), fileName);
}

export function exportToCsv(differenceSet: DifferenceSet, outputFilePath: string): void {
  let csvFileContent = formatCsvRow([
    'Difference type',
    'Entry type',
    'Relative entry path',
    'Absolute entry path',
  ]);

  [
    DifferenceType.SOURCE_ONLY,
    DifferenceType.DIFFERENT,
    DifferenceType.TARGET_ONLY,
  ].forEach((differenceType) => {
    differenceSet.getAll(differenceType).forEach((fsEntry) => {
      csvFileContent += formatCsvRow([
        formatDifferenceType(differenceType),
        formatFsEntryType(fsEntry),
        fsEntry.relativePath,
        fsEntry.absolutePath,
      ]);
    });
  });

  fs.writeFileSync(outputFilePath, csvFileContent);
}
