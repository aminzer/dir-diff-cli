#!/usr/bin/env node

import { ChalkDifferenceFormatter } from './formatters/index.js';
import { StdoutLogger } from './logging/index.js';
import main from './main.js';

const logger = new StdoutLogger();
const differenceFormatter = new ChalkDifferenceFormatter();

main({ logger, differenceFormatter });
