const {
  mountURL,
} = require('../config/config-mapping');
const logger = require('../logger/logger');
const { authenticatedRoutes } = require('../config/uri');

const log = logger('middleware:routing');

const onlyAuthenticatedRoutes = (middleware) => (req, res, next) => {
  log.debug(`Req path is ${req.path} and mountUrl is ${mountURL}`);
  const isAuthenticatedRoute = authenticatedRoutes.some((route) => {
    if (req.path.startsWith(route)) {
      log.debug(`Req path is ${req.path} and route is ${route}`);
      return true;
    }
    return false;
  });

  if (isAuthenticatedRoute) {
    return middleware(req, res, next);
  }
  return next();
};

module.exports = {
  onlyAuthenticatedRoutes,
};
