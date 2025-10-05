import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { getPackageVersion } from '../showVersion/index.js';
import main from '../main.js';
import TestDifferenceFormatter from './TestDifferenceFormatter.js';
import TestLogger from './TestLogger.js';

describe('version', () => {
  const logger = new TestLogger();
  const differenceFormatter = new TestDifferenceFormatter();

  beforeEach(async () => {
    logger.reset();

    process.argv = ['node', '.', 'version'];

    await main({ logger, differenceFormatter });
  });

  it('outputs the current library version', async () => {
    const logs = logger.getMessages();
    assert.strictEqual(logs.length, 1);

    const version = logs[0];
    assert.match(version, /^v\d+\.\d+\.\d+$/);
    assert.strictEqual(version, `v${getPackageVersion()}`);
  });

  it("doesn't output any single line messages", async () => {
    assert.deepStrictEqual(logger.getSingleLineMessages(), []);
  });
});
