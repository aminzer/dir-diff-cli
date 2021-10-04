export enum Commands {
  COMPARE_DIRECTORIES = 'compare',
  SHOW_HELP_MESSAGE = 'help',
  SHOW_VERSION = 'version',
}

export enum CompareDirectoriesArgs {
  SOURCE_DIR_PATH = 'source',
  TARGET_DIR_PATH = 'target',
  SKIP_SOURCE_ONLY = 'skip-source-only',
  SKIP_TARGET_ONLY = 'skip-target-only',
  SKIP_DIFFERENT = 'skip-different',
  SKIP_CONTENT_COMPARISON = 'skip-content-comparison',
  SKIP_EXCESS_NESTED_ITERATIONS = 'skip-excess-nested-iterations',
  LOG_DIFFERENCE_SET_TO_CSV = 'log-csv',
}
