import assert from 'node:assert';
import { join, sep } from 'node:path';
import { beforeEach, describe, it } from 'node:test';
import main from '../main.js';
import InMemoryLogger from './InMemoryLogger.js';
import { green_end, green_start, red_end, red_start, yellow_end, yellow_start } from './colors.js';

describe('compare', () => {
  const logger = new InMemoryLogger();

  beforeEach(() => {
    logger.reset();
  });

  describe('when source path does not exist', () => {
    const sourceDirPath = join(import.meta.dirname, 'invalid/path');
    const targetDirPath = import.meta.dirname;

    beforeEach(async () => {
      process.argv = ['node', '.', 'compare', '--source', sourceDirPath, '--target', targetDirPath];

      await main({ logger });
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

      await main({ logger });
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

      await main({ logger });
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

      await main({ logger });
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

        await main({ logger });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '',
          '',
          '',
          `${green_start}source-only${green_end} |     | .dot_file_added`,
          `${green_start}source-only${green_end} |     | file1_added.txt`,
          `${green_start}source-only${green_end} |     | file2_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir1_added`,
          `${green_start}source-only${green_end} |     | subdir1_added${sep}file11_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}file22_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir2${sep}subdir22_added`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `${yellow_start}different  ${yellow_end} |     | file5_modified_content.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}file23_modified_size.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `${red_start}target-only${red_end} |     | file6_removed.txt`,
          `${red_start}target-only${red_end} |     | subdir2${sep}file24_removed.txt`,
          `${red_start}target-only${red_end} | dir | subdir3_removed`,
          `${red_start}target-only${red_end} |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: ${green_start}7${green_end} source-only files, ${green_start}2${green_end} source-only dirs, ${yellow_start}3${yellow_end} different files, ${red_start}3${red_end} target-only files, ${red_start}1${red_end} target-only dirs.`,
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

        await main({ logger });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Source-only files/directories are not considered (--skip-source-only)',
          '',
          '',
          '',
          `${yellow_start}different  ${yellow_end} |     | file5_modified_content.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}file23_modified_size.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `${red_start}target-only${red_end} |     | file6_removed.txt`,
          `${red_start}target-only${red_end} |     | subdir2${sep}file24_removed.txt`,
          `${red_start}target-only${red_end} | dir | subdir3_removed`,
          `${red_start}target-only${red_end} |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: ${yellow_start}3${yellow_end} different files, ${red_start}3${red_end} target-only files, ${red_start}1${red_end} target-only dirs.`,
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

        await main({ logger });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Target-only files/directories are not considered (--skip-target-only)',
          '',
          '',
          '',
          `${green_start}source-only${green_end} |     | .dot_file_added`,
          `${green_start}source-only${green_end} |     | file1_added.txt`,
          `${green_start}source-only${green_end} |     | file2_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir1_added`,
          `${green_start}source-only${green_end} |     | subdir1_added${sep}file11_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}file22_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir2${sep}subdir22_added`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `${yellow_start}different  ${yellow_end} |     | file5_modified_content.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}file23_modified_size.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: ${green_start}7${green_end} source-only files, ${green_start}2${green_end} source-only dirs, ${yellow_start}3${yellow_end} different files.`,
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

        await main({ logger });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Different files are not considered (--skip-different)',
          '',
          '',
          '',
          `${green_start}source-only${green_end} |     | .dot_file_added`,
          `${green_start}source-only${green_end} |     | file1_added.txt`,
          `${green_start}source-only${green_end} |     | file2_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir1_added`,
          `${green_start}source-only${green_end} |     | subdir1_added${sep}file11_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}file22_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir2${sep}subdir22_added`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `${red_start}target-only${red_end} |     | file6_removed.txt`,
          `${red_start}target-only${red_end} |     | subdir2${sep}file24_removed.txt`,
          `${red_start}target-only${red_end} | dir | subdir3_removed`,
          `${red_start}target-only${red_end} |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: ${green_start}7${green_end} source-only files, ${green_start}2${green_end} source-only dirs, ${red_start}3${red_end} target-only files, ${red_start}1${red_end} target-only dirs.`,
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

        await main({ logger });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Content comparison is skipped, files are compared by size only (--skip-content-comparison)',
          '',
          '',
          '',
          `${green_start}source-only${green_end} |     | .dot_file_added`,
          `${green_start}source-only${green_end} |     | file1_added.txt`,
          `${green_start}source-only${green_end} |     | file2_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir1_added`,
          `${green_start}source-only${green_end} |     | subdir1_added${sep}file11_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}file22_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir2${sep}subdir22_added`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir22_added${sep}file221_added.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}file23_modified_size.txt`,
          `${red_start}target-only${red_end} |     | file6_removed.txt`,
          `${red_start}target-only${red_end} |     | subdir2${sep}file24_removed.txt`,
          `${red_start}target-only${red_end} | dir | subdir3_removed`,
          `${red_start}target-only${red_end} |     | subdir3_removed${sep}file31_removed.txt`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 24 files, 7 directories.\n' +
            `Found: ${green_start}7${green_end} source-only files, ${green_start}2${green_end} source-only dirs, ${yellow_start}1${yellow_end} different files, ${red_start}3${red_end} target-only files, ${red_start}1${red_end} target-only dirs.`,
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

        await main({ logger });
      });

      it('outputs the expected log messages', async () => {
        assert.deepStrictEqual(logger.getMessages(), [
          `Path to the source directory: "${sourceDirPath}"`,
          `Path to the target directory: "${targetDirPath}"`,
          '! Children of source-only and target-only directories are not considered (--skip-excess-nested-iterations)',
          '',
          '',
          '',
          `${green_start}source-only${green_end} |     | .dot_file_added`,
          `${green_start}source-only${green_end} |     | file1_added.txt`,
          `${green_start}source-only${green_end} |     | file2_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir1_added`,
          `${green_start}source-only${green_end} |     | subdir2${sep}file22_added.txt`,
          `${green_start}source-only${green_end} |     | subdir2${sep}subdir21${sep}file212_added.txt`,
          `${green_start}source-only${green_end} | dir | subdir2${sep}subdir22_added`,
          `${yellow_start}different  ${yellow_end} |     | file5_modified_content.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}file23_modified_size.txt`,
          `${yellow_start}different  ${yellow_end} |     | subdir2${sep}subdir21${sep}file213_modified_content.txt`,
          `${red_start}target-only${red_end} |     | file6_removed.txt`,
          `${red_start}target-only${red_end} |     | subdir2${sep}file24_removed.txt`,
          `${red_start}target-only${red_end} | dir | subdir3_removed`,
        ]);
      });

      it('outputs the expected single line messages', async () => {
        assert.deepStrictEqual(logger.getSingleLineMessages(), [
          'Comparison is finished.\n' +
            'Processed: 21 files, 7 directories.\n' +
            `Found: ${green_start}5${green_end} source-only files, ${green_start}2${green_end} source-only dirs, ${yellow_start}3${yellow_end} different files, ${red_start}2${red_end} target-only files, ${red_start}1${red_end} target-only dirs.`,
        ]);
      });
    });
  });
});
