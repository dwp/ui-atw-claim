const { getBackLinkFromQueryParameter } = require('../../utils/link-util');

module.exports = () => (req, res) => {
  const { cookieConsentError } = req.session;
  const { t } = res.locals;
  req.session.cookieConsentError = undefined;

  const backLink = getBackLinkFromQueryParameter(req);
  const hideBackButton = true;

  res.render('pages/cookies/cookie-policy.njk', {
    formErrorsGovukArray: cookieConsentError && [{
      text: t(cookieConsentError),
      href: '#f-cookieConsent',
    }],
    formErrors: cookieConsentError && {
      cookieConsent: [{
        summary: cookieConsentError,
        inline: cookieConsentError,
      }],
    },
    backLink,
    hideBackButton,
  });
};
