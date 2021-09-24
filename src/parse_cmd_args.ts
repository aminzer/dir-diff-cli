import * as commandLineArgs from 'command-line-args';

const cmdArgDefinitions = [
  {
    name: 'source',
    alias: 's',
    type: String,
  }, {
    name: 'target',
    alias: 't',
    type: String,
  }, {
    name: 'skip-added',
    alias: 'a',
    type: Boolean,
  }, {
    name: 'skip-modified',
    alias: 'm',
    type: Boolean,
  }, {
    name: 'skip-removed',
    alias: 'r',
    type: Boolean,
  }, {
    name: 'skip-content-comparison',
    alias: 'c',
    type: Boolean,
  }, {
    name: 'skip-extra-iterations',
    alias: 'e',
    type: Boolean,
  }, {
    name: 'help',
    type: Boolean,
  },
];

export default function parseCmdArgs() {
  return commandLineArgs(cmdArgDefinitions);
}
