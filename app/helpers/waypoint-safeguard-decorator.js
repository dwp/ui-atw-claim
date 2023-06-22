const { stashPreGatherSnapshot, restorePreGatherSnapshot } = require('../utils/stash-util');

const logger = require('../logger/logger');

const log = logger('helpers:waypoint-safeguard-decorator');

const buildPreValidateFunction = (page) => {
  const originalPrevalidate = page.hooks?.prevalidate;
  log.debug('originalPrevalidate', originalPrevalidate);

  return originalPrevalidate
    ? (req, res, next) => {
      stashPreGatherSnapshot(req);
      originalPrevalidate(req, res, next);
    }
    : (req, res, next) => {
      stashPreGatherSnapshot(req);
      next();
    };
};

const buildPostValidateFunction = (page) => {
  const originalPostvalidate = page.hooks?.postvalidate;
  log.debug(`originalPostvalidate for page ${page.view}`, originalPostvalidate === true);

  return originalPostvalidate
    ? (req, res, next) => {
      restorePreGatherSnapshot(req);
      originalPostvalidate(req, res, next);
    }
    : (req, res, next) => {
      restorePreGatherSnapshot(req);
      next();
    };
};

const wrapHooksWithCustomImplementation = (page) => ({
  ...page.hooks,
  prevalidate: buildPreValidateFunction(page),
  postvalidate: buildPostValidateFunction(page),
});

const decoratePage = (page) => ({
  ...page,
  ...(page.hooks && { hooks: wrapHooksWithCustomImplementation(page) }),
});

module.exports = {
  decoratePage,
};
