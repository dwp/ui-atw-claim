const fs = require('fs');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const logger = require('../logger/logger');
const {
  mountURL,
  enableNinoAllowList,
} = require('../config/config-mapping');
const { onlyAuthenticatedRoutes } = require('./routing');
const { PUBLIC_URL } = require('../config/uri');
const oauthTokenFetcher = require('./fetchers/oauth-token-fetcher');
const ninoFetcher = require('./fetchers/nino-fetcher');
const accountDataFetcher = require('./fetchers/account-data-fetcher');
const getGuidFromJwt = require('../helpers/jwt-helper');

const log = logger('middleware:account');

const getAllowedNinos = () => fs.readFileSync('allowedNinos.txt', 'utf-8').split('\n').filter((nino) => nino !== '');

const allowedNinos = getAllowedNinos();

module.exports = (
  app,
) => {
  app.use(onlyAuthenticatedRoutes(async (req, res, next) => {
    log.debug('middleware: account.middleware');
    try {
      const guid = await getGuidFromJwt(req);

      if (req.casa.journeyContext.getDataForPage('__guid__')?.guid === guid
      && req.casa.journeyContext.getDataForPage('__hidden_account__')) {
        log.debug('Account data already in session and guid matches');
        return next();
      }
      log.debug('Account data not in session');

      req.casa.journeyContext.setDataForPage('__guid__', { guid });

      const oauthToken = process.env.NODE_ENV === 'production'
        ? await oauthTokenFetcher.getOAuthToken()
        : 'TEST';

      log.debug(`Oauth token is ${oauthToken}`);

      const nino = await ninoFetcher.getNinoFromDwpGuid(guid, oauthToken);

      if (!nino) {
        log.warn(`Could not obtain a nino from ${guid}`);
        return res.redirect(`${PUBLIC_URL}/account-not-found`);
      }

      if (enableNinoAllowList === true) {
        log.debug('Nino allow list enabled');
        if (!allowedNinos.includes(nino)) {
          return res.redirect(`${PUBLIC_URL}/cannot-use-service`);
        }
      } else {
        log.debug(`Nino allow list disabled, values was ${enableNinoAllowList}`);
      }

      const account = await accountDataFetcher.getAccountData(nino);

      if (!account) {
        log.warn('No account data found');
        return res.redirect(`${PUBLIC_URL}/account-not-found`);
      }
      req.casa.journeyContext.setDataForPage('__hidden_account__', { account });
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      return req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    } catch (e) {
      log.error('Error in account middleware');
      log.error(e);
      return res.redirect(`${mountURL}problem-with-service`);
    }
  }));
};
