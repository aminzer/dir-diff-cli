import { stdout } from 'single-line-log';

export const { log } = console;
export const logSingleLine = stdout;
export const clearSingleLine = stdout.clear;
