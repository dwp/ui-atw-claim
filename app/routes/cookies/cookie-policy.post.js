const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const setConsentCookie = require('../../utils/set-consent-cookie');
const removeGTMCookies = require('../../utils/remove-gtm-cookies');

module.exports = (consentCookieName, mountUrl, gtmDomain, useTLS) => (req, res) => {
  const { cookieConsent } = req.body;

  const { referrer } = req.query;
  const referrerString = referrer.replace(/\/+/g, '/')
    .replace(/[.:]+/g, '');
  const listOfVisitedPages = referrerString.split('?referrer=');
  const backLink = listOfVisitedPages.pop();
  const redirectUrl = `${mountUrl}${req.url}`;

  // Validation error, set messeage in session and redirect back to this page
  if (!cookieConsent || (cookieConsent !== 'reject' && cookieConsent !== 'accept')) {
    req.session.cookieConsentError = 'cookie-policy:field.cookieConsent.required';
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    if (redirectUrl.includes('/claim')) {
      return req.session.save(() => res.redirect(redirectUrl));;
    }
  }

  // Validation successful, set cookie and redirect back where they came from
  // via referrer query string, if it exists
  setConsentCookie(req, res, consentCookieName, cookieConsent, mountUrl, useTLS);

  // If rejected, remove any GA cookies
  if (cookieConsent === 'reject') {
    removeGTMCookies(req, res);
  }
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  if (backLink.includes('/claim')) {
    return req.session.save(() => res.redirect(backLink));;
  }
};
