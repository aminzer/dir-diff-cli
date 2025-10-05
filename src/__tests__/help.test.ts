import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import main from '../main.js';
import TestDifferenceFormatter from './TestDifferenceFormatter.js';
import TestLogger from './TestLogger.js';

describe('help', () => {
  const logger = new TestLogger();
  const differenceFormatter = new TestDifferenceFormatter();

  beforeEach(async () => {
    logger.reset();

    process.argv = ['node', '.', 'help'];

    await main({ logger, differenceFormatter });
  });

  it('outputs the current library version', async () => {
    assert.deepStrictEqual(logger.getMessages(), [
      '\n' +
        'Compare directories:\n' +
        'dir-diff compare [args...]\n' +
        '  --source <path>                 (-s) - path to the source directory\n' +
        '  --target <path>                 (-t) - path to the target directory\n' +
        '  --skip-source-only              (-S) - source-only files/directories are not considered\n' +
        '  --skip-target-only              (-T) - target-only files/directories are not considered\n' +
        '  --skip-different                (-D) - different files are not considered\n' +
        '  --skip-content-comparison       (-C) - content comparison is skipped, files are compared by size only\n' +
        '  --skip-excess-nested-iterations (-X) - children of source-only and target-only directories are not considered\n' +
        '  --log-csv                            - directory difference is logged into csv file\n' +
        '\n' +
        'Get version:\n' +
        'dir-diff version\n',
    ]);
  });

  it("doesn't output any single line messages", async () => {
    assert.deepStrictEqual(logger.getSingleLineMessages(), []);
  });
});
