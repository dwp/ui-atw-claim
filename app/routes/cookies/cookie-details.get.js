const { getBackLinkFromQueryParameter } = require('../../utils/link-util');

module.exports = (consentCookieName, sessionCookieName, sessionTtl) => (req, res) => {
  const backLink = getBackLinkFromQueryParameter(req);
  const hideBackButton = true;

  res.render('pages/cookies/cookie-details.njk', {
    cookiePolicyUrl: 'cookie-policy',
    sessionMinutes: sessionTtl,
    consentCookieName,
    sessionCookieName,
    backLink,
    hideBackButton,
  });
};
