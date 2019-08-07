### Overview

Command line tool for recursive directory comparison.

### Installation

```
npm install -g @aminzer/dir-diff-cli
```

### Usage Example

```
dir-diff --source "d:/work" --target "e:/backups/work"
```

##### Arguments

* --help                         : show tool help
* --source {path}           (-s) : path to the source directory
* --target {path}           (-t) : path to the target directory
* --skip-added              (-a) : added files/directories are not considered
* --skip-modified           (-m) : modified files are not considered
* --skip-removed            (-r) : removed files/directories are not considered
* --skip-content-comparison (-c) : files are compared by size only; content comparison is skipped
* --skip-extra-iterations   (-e) : child-entries of added/removed directories are not considered
