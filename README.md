### Overview

Command line tool for recursive directory comparison.

### Installation

```
npm install -g @aminzer/dir-diff-cli
```

### Compare directories

```
dir-diff compare --source "d:/work" --target "e:/backups/work"
```

##### Arguments

* --source <path>                 (-s) - path to the source directory
* --target <path>                 (-t) - path to the target directory
* --skip-source-only              (-S) - source-only files/directories are not considered
* --skip-target-only              (-T) - target-only files/directories are not considered
* --skip-different                (-D) - different files are not considered
* --skip-content-comparison       (-C) - content comparison is skipped, files are compared by size only
* --skip-excess-nested-iterations (-X) - children of source-only and target-only directories are not considered

### Show help message

```
dir-diff help
```

### Show version

```
dir-diff version
```
