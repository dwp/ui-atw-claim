const { endSession } = require('../lib/utils/session-helper');
const {
  PUBLIC_CONTEXT_PATH,
} = require('../config/uri');

module.exports = (casaApp) => {
  const timeOutPage = (req, res) => {
    const nextPageViewFile = 'pages/time-out/time-out.njk';
    endSession(casaApp, req, res, nextPageViewFile);
  };

  casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/time-out`, casaApp.csrfMiddleware, timeOutPage);

  return timeOutPage;
};
