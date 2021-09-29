export enum Commands {
  SHOW_HELP_MESSAGE = 'help',
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
