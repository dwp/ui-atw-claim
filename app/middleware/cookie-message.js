/* eslint no-bitwise: ["error", { "allow": ["^", ">>>", "&"] }] */

const qs = require('querystring');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const setConsentCookie = require('../utils/set-consent-cookie');
const removeGTMCookies = require('../utils/remove-gtm-cookies');
const logger = require('../logger/logger');
const getGuidFromJwt = require('../helpers/jwt-helper');

const log = logger('middleware:cookie-message');

// This algorithm will create a 64-bit hash
// but as Javascript is limited to 53-bit integers it limits it to 53-bits
// https://stackoverflow.com/a/52171480/4644407
const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return Math.abs(4294967296 * (2097151 & h2) + (h1 >>> 0));
};

module.exports = (
  app,
  consentCookieName,
  cookiePolicyWaypoint,
  cookieConsentWaypoint,
  gtmDomain,
  mountUrl = '/',
  proxyMountUrl = mountUrl,
  useTLS = false,
) => {
  const sanitiseUrl = (url) => url.replace(/\/+/g, '/');

  // URL to cookie policy page
  const cookiePolicyUrl = `${mountUrl}${cookiePolicyWaypoint}`;

  const staticIdentifier = async (req) => {
    const staticKey = 'atw-ui-claim-service';
    const guid = await getGuidFromJwt(req);
    if (guid) {
      return cyrb53(`${guid}${staticKey}`);
    }
    return undefined;
  };

  // Set template options for cookie consent banner
  app.use(async (req, res, next) => {
    res.locals.userIdentifier = await staticIdentifier(req);

    log.debug(`User identifier ${res.locals.userIdentifier}`);
    res.locals.sessionId = req.sessionId;
    // Get cookie banner flash messages (did you accept / reject)
    if (req.session) {
      res.locals.cookieChoiceMade = req.session.cookieChoiceMade;
      req.session.cookieChoiceMade = undefined;
    }

    // Add current consent cookie value to templates
    if (req.cookies[consentCookieName]) {
      res.locals.cookieMessage = req.cookies[consentCookieName];
    } else {
      res.locals.cookieMessage = 'unset';
    }

    // Url to submit consent to (used in banner)
    res.locals.cookieConsentSubmit = cookieConsentWaypoint;

    // Set referrer query param
    const {
      pathname,
      search,
    } = new URL(String(req.url), 'http://dummy.test/');
    const currentUrl = mountUrl.slice(0, -1) + sanitiseUrl(pathname + search);

    // If already on cookie policy page, don't need set referrer again
    res.locals.cookiePolicyUrl = pathname === cookiePolicyUrl
      ? currentUrl
      : `${cookiePolicyUrl}?${qs.stringify({ referrer: currentUrl })}`;

    res.locals.currentUrl = currentUrl;

    // Set referrer policy
    res.set('Referrer-Policy', 'same-origin');
    next();
  });

  // Handle setting consent cookie from banner submission
  app.post(`${proxyMountUrl}${cookieConsentWaypoint}`, (req, res) => {
    const { cookieConsent } = req.body;

    if (cookieConsent === 'reject' || cookieConsent === 'accept') {
      setConsentCookie(req, res, consentCookieName, cookieConsent, mountUrl, useTLS);
    }
    // If rejected, remove any GA cookies
    if (cookieConsent === 'reject') {
      removeGTMCookies(req, res, gtmDomain);
    }

    const referrer = req.get('Referrer');

    if (referrer && !/^javascript:/.test(referrer)) {
      const {
        pathname,
        search,
      } = new URL(referrer, 'http://dummy.test/');
      const redirectBackTo = sanitiseUrl(pathname + search);
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save(() => res.redirect(redirectBackTo));
    } else {
      res.redirect(mountUrl);
    }
  });
};
