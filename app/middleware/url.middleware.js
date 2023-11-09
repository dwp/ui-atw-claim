const { mountURL } = require('../config/config-mapping');
const {
  PUBLIC_URL,
  ACCOUNT_ROOT_URL,
  PERSONAL_INFORMATION_URL,
  GRANT_ROOT_URL
} = require('../config/uri');
const logger = require('../logger/logger');

const log = logger('middleware:url');

module.exports = (
  app,
) => {
  app.use(async (_req, res, next) => {
    log.debug('middleware: url.middleware');

    res.locals.feedbackFormDirectUrl = `https://forms.office.com/e/AUEh16RY5S`;
    res.locals.cookieDetailsUrl = `${mountURL}cookie-details?referrer=${res.locals.currentUrl}`;
    res.locals.acessibilityStatementUrl = `${PUBLIC_URL}/accessibility-statement?referrer=${res.locals.currentUrl}`;

    res.locals.personalBaseUrl = PERSONAL_INFORMATION_URL;
    res.locals.accountBaseUrl = ACCOUNT_ROOT_URL;
    res.locals.grantBaseUrl = GRANT_ROOT_URL;
    next();
  });
};
