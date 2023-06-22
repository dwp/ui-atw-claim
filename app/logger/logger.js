const debug = require('debug');

const uiClaimDebugger = debug('ui-claim');

module.exports = (namespace) => {
  const logger = uiClaimDebugger.extend(namespace);

  return {
    trace: logger.extend('trace'),
    debug: logger.extend('debug'),
    info: logger.extend('info'),
    warn: logger.extend('warn'),
    error: logger.extend('error'),
    fatal: logger.extend('fatal'),
  };
};
