const config = require('config');
const { endSession } = require('../lib/utils/session-helper');
const {
  PUBLIC_CONTEXT_PATH,
} = require('../config/uri');

module.exports = (casaApp) => {
  const signOut = (req, res) => {
    const kongSessionName = config.get('services.oidv.kongSessionName');
    if (req.cookies[kongSessionName]) {
      res.clearCookie(kongSessionName);
    }
    const nextPageViewFile = 'pages/sign-out/sign-out.njk';
    endSession(casaApp, req, res, nextPageViewFile);
  };

  casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/sign-out`, casaApp.csrfMiddleware, signOut);

  return signOut;
};
