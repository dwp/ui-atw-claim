 
const { onlyAuthenticatedRoutes } = require('./routing');
const logger = require('../logger/logger');
const timeOutConfig = require('../config/time-out');
const { mountURL } = require('../config/config-mapping');

const log = logger('middleware:time-out');

const enableTimeOutFunctionality = (res) => {
  res.locals.timeOut = { shouldTimeOut: true, ...timeOutConfig };
};

let previousRequestUrl = mountURL;

const wasPageRefreshed = (req) => req.path === previousRequestUrl;

const setupActivityTimer = (req) => {
  const timerInMilliseconds = timeOutConfig.timeAfterWhichToShowWarningInSeconds * 1000;

  setTimeout(() => {
    req.app.locals.shouldDisplayNoJsTimeoutWarningBanner = true;
  }, timerInMilliseconds);
};

const removeNoJsBannerIfUserWasActive = (req) => {
  if (!wasPageRefreshed(req)) {
    req.app.locals.shouldDisplayNoJsTimeoutWarningBanner = false;
  }
};

const keepTrackOfPreviousUrl = (req) => {
  previousRequestUrl = req.path;
};

module.exports = (
  app,
) => {
  app.use(onlyAuthenticatedRoutes(async (req, res, next) => {
    log.debug('middleware: time-out.middleware');

    enableTimeOutFunctionality(res);

    setupActivityTimer(req);

    removeNoJsBannerIfUserWasActive(req);

    keepTrackOfPreviousUrl(req);

    next();
  }));
};
