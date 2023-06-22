const axios = require('axios');
const qs = require('qs');
const {
  guidLookup,
  cognito,
} = require('../../config/config-mapping');
const proxyFactory = require('../proxy-factory');
const logger = require('../../logger/logger');

const log = logger('fetchers:oauth-token');

const publicProxyTunnel = proxyFactory.getPublicProxyTunnel();

// eslint-disable-next-line consistent-return
const getOAuthToken = async () => {
  const endpointUrl = `${cognito.url}/oauth2/token`;
  const { exchangeCredentials } = guidLookup;
  const credentials = JSON.parse(exchangeCredentials);
  const base64EncodedCredentials = Buffer.from(`${credentials.client_id}:${credentials.secret}`)
    .toString('base64');

  const data = qs.stringify({
    grant_type: 'client_credentials',
  });

  log.debug(`Trying to get OAuth token from: ${endpointUrl}`);
  try {
    const oauthResult = await axios({
      httpsAgent: publicProxyTunnel,
      proxy: false,
      method: 'post',
      url: endpointUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64EncodedCredentials}`,
      },
      data,
    });
    log.debug(`OAuth response: ${oauthResult.data}`);
    return oauthResult.data.access_token;
  } catch (error) {
    log.error(`Unexpected status code from COGNITO, ${JSON.stringify(error, null, 2)}`);
    throw error;
  }
};

module.exports = { getOAuthToken };
