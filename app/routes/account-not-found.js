const {
  PUBLIC_CONTEXT_PATH,
} = require('../config/uri');
const { endSession } = require('../lib/utils/session-helper');

module.exports = (casaApp) => {
  const accountNotFoundPage = (req, res) => {
    const nextPageViewFile = 'pages/account/account-not-found.njk';
    endSession(casaApp, req, res, nextPageViewFile);
  };

  casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/account-not-found`, casaApp.csrfMiddleware, accountNotFoundPage);

  return accountNotFoundPage;
};
