const { log } = require('./logging');

module.exports = args => {
  log(`Source directory: "${args['source']}"`);
  log(`Target directory: "${args['target']}"`);

  if (args['skip-added']) {
    log(' ! Added files are not considered. [ --skip-added ]');
  }

  if (args['skip-modified']) {
    log(' ! Modified files are not considered. [ --skip-modified ]');
  }

  if (args['skip-removed']) {
    log(' ! Removed files/directories are not considered. [ --skip-removed ]');
  }

  if (args['skip-content-comparison']) {
    log(' ! Files are compared by size only. Content comparison is skipped. [ --skip-content-comparison ]');
  }

  if (args['skip-extra-iterations']) {
    log(' ! Children of added/removed directories are not considered. [ --skip-extra-iterations ]');
  }
};
