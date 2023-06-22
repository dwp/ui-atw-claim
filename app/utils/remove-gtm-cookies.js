const { mountURL } = require('../config/config-mapping');

const removeGTMCookies = (req, res, domain) => {
  if (req.headers.cookie) {
    const gatCookieName = req.headers.cookie.match(/_gat[^=;]*/);
    const options = { path: mountURL };

    if (domain) {
      options.domain = domain;
    }

    if (gatCookieName) {
      res.clearCookie(gatCookieName[0], options);
    }

    res.clearCookie('_ga', options);
    res.clearCookie('_gid', options);
  }
};

module.exports = removeGTMCookies;
