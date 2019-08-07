module.exports = [
  '  --source <path>           (-s) : path to the source directory',
  '  --target <path>           (-t) : path to the target directory',
  '  --skip-added              (-a) : added files/directories are not considered',
  '  --skip-modified           (-m) : modified files are not considered',
  '  --skip-removed            (-r) : removed files/directories are not considered',
  '  --skip-content-comparison (-c) : files are compared by size only; content comparison is skipped',
  '  --skip-extra-iterations   (-e) : child-entries of added/removed directories are not considered'
].join('\n');
