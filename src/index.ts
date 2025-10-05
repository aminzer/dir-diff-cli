#!/usr/bin/env node

import { StdoutLogger } from './logging/index.js';
import main from './main.js';

const logger = new StdoutLogger();

main({ logger });
