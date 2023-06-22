const oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;

// Set the consent cookie and flash message to consent banner
const setConsentCookie = (req, res, consentCookieName, cookieValue, mountUrl = '/', useTLS = false) => {
  res.cookie(consentCookieName, cookieValue, {
    path: mountUrl,
    maxAge: oneYearInMilliseconds,
    httpOnly: false,
    sameSite: true,
    secure: useTLS,
  });
  req.session.cookieChoiceMade = true;
};

module.exports = setConsentCookie;
