const {
  cookieDomain, cookiePath,
} = require('../config/config-mapping');

const removeGTMCookies = (req, res) => {
  if (req.headers.cookie) {

    req.headers.cookie.match(/_ga[^=;]*/g)?.forEach((cookie) => res.clearCookie(cookie, {
      path: cookiePath,
      domain: cookieDomain,
    }));
  }
};

module.exports = removeGTMCookies;
