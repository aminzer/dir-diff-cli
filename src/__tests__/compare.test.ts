import assert from 'node:assert';
import { readFileSync, unlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import main from '../main.js';
import TestDifferenceFormatter from './TestDifferenceFormatter.js';
import TestLogger from './TestLogger.js';

describe('compare', () => {
  const logger = new TestLogger();
  const differenceFormatter = new TestDifferenceFormatter();

  beforeEach(() => {
    logger.reset();
  });

  describe('when source path does not exist', () => {
    const sourceDirPath = join(import.meta.dirname, 'invalid/path');
    const targetDirPath = import.meta.dirname;

    beforeEach(async () => {
      process.argv = ['node', '.', 'compare', '--source', sourceDirPath, '--target', targetDirPath];

      await main({ logger, differenceFormatter });
    });

    it('outputs the expected log messages', async () => {
      assert.deepStrictEqual(logger.getMessages(), [
        `Path to the source directory: "${sourceDirPath}"`,
        `Path to the target directory: "${targetDirPath}"`,
        '',
        '',
        `Error: Source directory "${sourceDirPath}" does not exist`,
        'Run "dir-diff help" to see the usage instructions.',
      ]);
    });
  });

  describe('when target path does not exist', () => {
    const sourceDirPath = import.meta.dirname;
    const targetDirPath = join(import.meta.dirname, 'invalid/path');

    beforeEach(async () => {
      process.argv = ['node', '.', 'compare', '--source', sourceDirPath, '--target', targetDirPath];

      await main({ logger, differenceFormatter });
    });

    it('outputs the expected log messages', async () => {
      assert.deepStrictEqual(logger.getMessages(), [
        `Path to the source directory: "${sourceDirPath}"`,
        `Path to the target directory: "${targetDirPath}"`,
        '',
        '',
        `Error: Target directory "${targetDirPath}" does not exist`,
        'Run "dir-diff help" to see the usage instructions.',
      ]);
    });
  });

  describe('when source path corresponds to a file', () => {
    const sourceDirPath = import.meta.filename;
    const targetDirPath = import.meta.dirname;

    beforeEach(async () => {
      process.argv = ['node', '.', 'compare', '--source', sourceDirPath, '--target', targetDirPath];

      await main({ logger, differenceFormatter });
    });

    it('outputs the expected log messages', async () => {
      assert.deepStrictEqual(logger.getMessages(), [
        `Path to the source directory: "${sourceDirPath}"`,
        `Path to the target directory: "${targetDirPath}"`,
        '',
        '',
        `Error: Source directory "${sourceDirPath}" does not exist`,
        'Run "dir-diff help" to see the usage instructions.',
      ]);
    });
  });

  describe('when target path corresponds to a file', () => {
    const sourceDirPath = import.meta.dirname;
    const targetDirPath = import.meta.filename;

    beforeEach(async () => {
      process.argv = ['node', '.', 'compare', '--source', sourceDirPath, '--target', targetDirPath];

      await main({ logger, differenceFormatter });
    });

    it('outputs the expected log messages', async () => {
      assert.deepStrictEqual(logger.getMessages(), [
        `Path to the source directory: "${sourceDirPath}"`,
        `Path to the target directory: "${targetDirPath}"`,
        '',
        '',
        `Error: Target directory "${targetDirPath}" does not exist`,
        'Run "dir-diff help" to see the usage instructions.',
      ]);
    });
  });

  describe('when both paths corresponds to directories', () => {
    const sourceDirPath = join(import.meta.dirname, '../../test/resources/common/source');
    const targetDirPath = join(import.meta.dirname, '../../test/resources/common/target');

    describe('when no additional arguments are passed', () => {
      beforeEach(async () => {
        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
        ];

        await main({ logger, differenceFormatter });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '',
          '',
          '',
          `<green>source-only</green> |     | .dot_file_added`,
          `<green>source-only</green> |     | file1_added.txt`,
          `<green>source-only</green> |     | file2_added.txt`,
          `<green>source-only</green> | dir | subdir1_added`,
          `<green>source-only</green> |     | subdir1_added${sep}file11_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}file22_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `<green>source-only</green> | dir | subdir2${sep}subdir22_added`,
          `<green>source-only</green> |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `<yellow>different  </yellow> |     | file5_modified_content.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}file23_modified_size.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `<red>target-only</red> |     | file6_removed.txt`,
          `<red>target-only</red> |     | subdir2${sep}file24_removed.txt`,
          `<red>target-only</red> | dir | subdir3_removed`,
          `<red>target-only</red> |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: <green>7</green> source-only files, <green>2</green> source-only dirs, <yellow>3</yellow> different files, <red>3</red> target-only files, <red>1</red> target-only dirs.`,
        ]);
      });
    });

    describe('when "--skip-source-only" argument is passed', () => {
      beforeEach(async () => {
        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
          '--skip-source-only',
        ];

        await main({ logger, differenceFormatter });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Source-only files/directories are not considered (--skip-source-only)',
          '',
          '',
          '',
          `<yellow>different  </yellow> |     | file5_modified_content.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}file23_modified_size.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `<red>target-only</red> |     | file6_removed.txt`,
          `<red>target-only</red> |     | subdir2${sep}file24_removed.txt`,
          `<red>target-only</red> | dir | subdir3_removed`,
          `<red>target-only</red> |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: <yellow>3</yellow> different files, <red>3</red> target-only files, <red>1</red> target-only dirs.`,
        ]);
      });
    });

    describe('when "--skip-target-only" argument is passed', () => {
      beforeEach(async () => {
        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
          '--skip-target-only',
        ];

        await main({ logger, differenceFormatter });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Target-only files/directories are not considered (--skip-target-only)',
          '',
          '',
          '',
          `<green>source-only</green> |     | .dot_file_added`,
          `<green>source-only</green> |     | file1_added.txt`,
          `<green>source-only</green> |     | file2_added.txt`,
          `<green>source-only</green> | dir | subdir1_added`,
          `<green>source-only</green> |     | subdir1_added${sep}file11_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}file22_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `<green>source-only</green> | dir | subdir2${sep}subdir22_added`,
          `<green>source-only</green> |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `<yellow>different  </yellow> |     | file5_modified_content.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}file23_modified_size.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: <green>7</green> source-only files, <green>2</green> source-only dirs, <yellow>3</yellow> different files.`,
        ]);
      });
    });

    describe('when "--skip-different" argument is passed', () => {
      beforeEach(async () => {
        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
          '--skip-different',
        ];

        await main({ logger, differenceFormatter });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Different files are not considered (--skip-different)',
          '',
          '',
          '',
          `<green>source-only</green> |     | .dot_file_added`,
          `<green>source-only</green> |     | file1_added.txt`,
          `<green>source-only</green> |     | file2_added.txt`,
          `<green>source-only</green> | dir | subdir1_added`,
          `<green>source-only</green> |     | subdir1_added${sep}file11_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}file22_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `<green>source-only</green> | dir | subdir2${sep}subdir22_added`,
          `<green>source-only</green> |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `<red>target-only</red> |     | file6_removed.txt`,
          `<red>target-only</red> |     | subdir2${sep}file24_removed.txt`,
          `<red>target-only</red> | dir | subdir3_removed`,
          `<red>target-only</red> |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: <green>7</green> source-only files, <green>2</green> source-only dirs, <red>3</red> target-only files, <red>1</red> target-only dirs.`,
        ]);
      });
    });

    describe('when "--skip-content-comparison" argument is passed', () => {
      beforeEach(async () => {
        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
          '--skip-content-comparison',
        ];

        await main({ logger, differenceFormatter });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Content comparison is skipped, files are compared by size only (--skip-content-comparison)',
          '',
          '',
          '',
          `<green>source-only</green> |     | .dot_file_added`,
          `<green>source-only</green> |     | file1_added.txt`,
          `<green>source-only</green> |     | file2_added.txt`,
          `<green>source-only</green> | dir | subdir1_added`,
          `<green>source-only</green> |     | subdir1_added${sep}file11_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}file22_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `<green>source-only</green> | dir | subdir2${sep}subdir22_added`,
          `<green>source-only</green> |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}file23_modified_size.txt`,
          `<red>target-only</red> |     | file6_removed.txt`,
          `<red>target-only</red> |     | subdir2${sep}file24_removed.txt`,
          `<red>target-only</red> | dir | subdir3_removed`,
          `<red>target-only</red> |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: <green>7</green> source-only files, <green>2</green> source-only dirs, <yellow>1</yellow> different files, <red>3</red> target-only files, <red>1</red> target-only dirs.`,
        ]);
      });
    });

    describe('when "--skip-excess-nested-iterations" argument is passed', () => {
      beforeEach(async () => {
        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
          '--skip-excess-nested-iterations',
        ];

        await main({ logger, differenceFormatter });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Children of source-only and target-only directories are not considered (--skip-excess-nested-iterations)',
          '',
          '',
          '',
          `<green>source-only</green> |     | .dot_file_added`,
          `<green>source-only</green> |     | file1_added.txt`,
          `<green>source-only</green> |     | file2_added.txt`,
          `<green>source-only</green> | dir | subdir1_added`,
          `<green>source-only</green> |     | subdir2${sep}file22_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `<green>source-only</green> | dir | subdir2${sep}subdir22_added`,
          `<yellow>different  </yellow> |     | file5_modified_content.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}file23_modified_size.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `<red>target-only</red> |     | file6_removed.txt`,
          `<red>target-only</red> |     | subdir2${sep}file24_removed.txt`,
          `<red>target-only</red> | dir | subdir3_removed`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 21 files, 7 directories.\n' +
            `Found: <green>5</green> source-only files, <green>2</green> source-only dirs, <yellow>3</yellow> different files, <red>2</red> target-only files, <red>1</red> target-only dirs.`,
        ]);
      });
    });

    describe('when "--log-csv" argument is passed', () => {
      const mockedDate = new Date('2025-10-05 12:34:56.789');
      let originalDateNow: typeof Date.now;

      const expectedCsvFilePath = join(homedir(), 'dir_diff_20251005_123456789.csv');

      beforeEach(async () => {
        originalDateNow = Date.now;
        Date.now = () => mockedDate.getTime();

        process.argv = [
          'node',
          '.',
          'compare',
          '--source',
          sourceDirPath,
          '--target',
          targetDirPath,
          '--log-csv',
        ];

        await main({ logger, differenceFormatter });
      });

      afterEach(() => {
        Date.now = originalDateNow;

        unlinkSync(expectedCsvFilePath);
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Directory difference is logged into CSV file (--log-csv)',
          '',
          '',
          '',
          `<green>source-only</green> |     | .dot_file_added`,
          `<green>source-only</green> |     | file1_added.txt`,
          `<green>source-only</green> |     | file2_added.txt`,
          `<green>source-only</green> | dir | subdir1_added`,
          `<green>source-only</green> |     | subdir1_added${sep}file11_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}file22_added.txt`,
          `<green>source-only</green> |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `<green>source-only</green> | dir | subdir2${sep}subdir22_added`,
          `<green>source-only</green> |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `<yellow>different  </yellow> |     | file5_modified_content.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}file23_modified_size.txt`,
          `<yellow>different  </yellow> |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `<red>target-only</red> |     | file6_removed.txt`,
          `<red>target-only</red> |     | subdir2${sep}file24_removed.txt`,
          `<red>target-only</red> | dir | subdir3_removed`,
          `<red>target-only</red> |     | subdir3_removed${sep}file31_removed.txt`,
          '',
          `Directory difference is exported to: "${expectedCsvFilePath}"`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: <green>7</green> source-only files, <green>2</green> source-only dirs, <yellow>3</yellow> different files, <red>3</red> target-only files, <red>1</red> target-only dirs.`,
        ]);
      });

      it('creates the expected CSV file', async () => {
        const root = resolve(import.meta.dirname, '../../test/resources/common');
        const csvFileContent = readFileSync(expectedCsvFilePath, 'utf-8');

        assert.deepStrictEqual(
          csvFileContent,
          '"Difference type","Entry type","Relative entry path","Absolute entry path"\n' +
            `"source-only","file",".dot_file_added","${root}${sep}source${sep}.dot_file_added"\n` +
            `"source-only","file","file1_added.txt","${root}${sep}source${sep}file1_added.txt"\n` +
            `"source-only","file","file2_added.txt","${root}${sep}source${sep}file2_added.txt"\n` +
            `"source-only","dir","subdir1_added","${root}${sep}source${sep}subdir1_added"\n` +
            `"source-only","file","subdir1_added${sep}file11_added.txt","${root}${sep}source${sep}subdir1_added${sep}file11_added.txt"\n` +
            `"source-only","file","subdir2${sep}file22_added.txt","${root}${sep}source${sep}subdir2${sep}file22_added.txt"\n` +
            `"source-only","file","subdir2${sep}subdir21${sep}file212_added.txt","${root}${sep}source${sep}subdir2${sep}subdir21${sep}file212_added.txt"\n` +
            `"source-only","dir","subdir2${sep}subdir22_added","${root}${sep}source${sep}subdir2${sep}subdir22_added"\n` +
            `"source-only","file","subdir2${sep}subdir22_added${sep}file221_added.txt","${root}${sep}source${sep}subdir2${sep}subdir22_added${sep}file221_added.txt"\n` +
            `"different","file","file5_modified_content.txt","${root}${sep}source${sep}file5_modified_content.txt"\n` +
            `"different","file","subdir2${sep}file23_modified_size.txt","${root}${sep}source${sep}subdir2${sep}file23_modified_size.txt"\n` +
            `"different","file","subdir2${sep}subdir21${sep}file213_modified_content.txt","${root}${sep}source${sep}subdir2${sep}subdir21${sep}file213_modified_content.txt"\n` +
            `"target-only","file","file6_removed.txt","${root}${sep}target${sep}file6_removed.txt"\n` +
            `"target-only","file","subdir2${sep}file24_removed.txt","${root}${sep}target${sep}subdir2${sep}file24_removed.txt"\n` +
            `"target-only","dir","subdir3_removed","${root}${sep}target${sep}subdir3_removed"\n` +
            `"target-only","file","subdir3_removed${sep}file31_removed.txt","${root}${sep}target${sep}subdir3_removed${sep}file31_removed.txt"\n`,
        );
      });
    });
  });
});
