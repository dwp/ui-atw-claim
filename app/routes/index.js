const sign = require('jwt-encode');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { ACCOUNT_ROOT_URL } = require('../config/uri');
const logger = require('../logger/logger');

const log = logger('app:routes.index');

const getGuidFromNino = require('../utils/nino-to-guid-stub');

const secret = 'secret';

module.exports = (casaApp) => {
  const getIndex = (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
      casaApp.endSession(req)
        .then(() => {
          res.render('home.njk');
        });
    } else {
      res.redirect(`${ACCOUNT_ROOT_URL}/home`);
    }
  };

  const postIndex = (req, res) => {
    const nino = req.body.persona;

    const data = {
      at_hash: 'T-sQZdjwM_sscqXpo6vINg',
      sub: 'abofu856@example.com',
      auditTrackingId: 'edfba9ec-47a5-4137-9227-68f733d701c9-28986',
      iss: 'https://forgerock.local.lvh.me/am/oauth2/realms/root/realms/Citizens/realms/WEB',
      tokenName: 'id_token',
      aud: 'RMD-WEB',
      c_hash: '_thV6BlF81bJEZ9N6dDr-w',
      acr: 'Auth-Level-Medium',
      'org.forgerock.openidconnect.ops': 'NW6MDOkGgBASwPsuDSTYxKWUJBc',
      s_hash: 'a7XkGSpoxgtHdt-fmF3tmQ',
      azp: 'RMD-WEB',
      auth_time: 1637673521,
      guid: getGuidFromNino(nino),
      realm: '/Citizens/WEB',
      exp: 1637673641,
      tokenType: 'JWTToken',
      iat: 1637673521,
    };

    const jwt = sign(data, secret);
    log.debug(jwt);
    req.session.token = jwt;

    JourneyContext.putContext(req.session, req.casa.journeyContext);
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect(`${ACCOUNT_ROOT_URL}/home`);
    });
  };

  casaApp.router.get('/', (req, res) => {
    const requestOrigin = req.originalUrl;
    return requestOrigin.endsWith('/')
      ? getIndex(req, res)
      : res.redirect(`${requestOrigin}/`);
  });
  casaApp.router.post('/', postIndex);

  return {
    getIndex,
    postIndex,
  };
};
