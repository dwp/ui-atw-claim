const axios = require('axios');
const uuid = require('uuid');
const {
  guidLookup,
} = require('../../config/config-mapping');
const proxyFactory = require('../proxy-factory');
const logger = require('../../logger/logger');

const log = logger('fetchers:nino');
const privateProxyTunnel = proxyFactory.getPrivateProxyTunnel();

// eslint-disable-next-line consistent-return
const getNinoFromDwpGuid = async (guid, oauthToken) => {
  const endpointUrl = new URL(guidLookup.url);
  endpointUrl.pathname = `/citizen-information/dwp-guid-service/v0.2/NINO/for/DWP-GUID/${guid}`;

  log.debug(`Trying to get nino from: ${endpointUrl}`);
  if (endpointUrl.toString().includes('/citizen-information/')) {
    try {
      const guidResult = await axios({
        httpsAgent: privateProxyTunnel,
        proxy: false,
        method: 'get',
        url: endpointUrl.toString(),
        headers: {
          'correlation-id': uuid.v4(),
          Authorization: `Bearer ${oauthToken}`,
          'x-request-id': uuid.v4(),
        },
      });
      log.debug(`Guid response ${JSON.stringify(guidResult.data)}`);
      log.debug(`Guid response NINO ${guidResult.data.identifier}`);
  
      return guidResult.data.identifier;
    } catch (error) {
      log.error('Unexpected status code from guidLookup');
      log.error(error);
      return undefined;
    }
  }
};

module.exports = { getNinoFromDwpGuid };
