export enum Commands {
  SHOW_HELP = 'help',
  COMPARE_DIRECTORIES = 'compare',
}

export enum CompareDirectoriesArgs {
  SOURCE_DIR_PATH = 'source',
  TARGET_DIR_PATH = 'target',
  SKIP_SOURCE_ONLY = 'skip-source-only',
  SKIP_TARGET_ONLY = 'skip-target-only',
  SKIP_DIFFERENT = 'skip-different',
  SKIP_CONTENT_COMPARISON = 'skip-content-comparison',
  SKIP_EXCESS_NESTED_ITERATIONS = 'skip-excess-nested-iterations',
}

export enum CompareDirectoriesArgAliases {
  SOURCE_DIR_PATH = 's',
  TARGET_DIR_PATH = 't',
  SKIP_SOURCE_ONLY = 'S',
  SKIP_TARGET_ONLY = 'T',
  SKIP_DIFFERENT = 'D',
  SKIP_CONTENT_COMPARISON = 'C',
  SKIP_EXCESS_NESTED_ITERATIONS = 'X',
}
