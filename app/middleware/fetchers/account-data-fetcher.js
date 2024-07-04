const axios = require('axios');
const {
  discQuery,
} = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('fetchers:disc');

const getAccountData = async (nino) => {
  const endpointUrl = `${discQuery.url}/account`;

  log.debug(`Trying to get account data from: ${endpointUrl}`);
  try {
    const result = await axios({
      method: 'post',
      url: endpointUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        nino,
      },
    });
    return result.data;
  } catch (error) {
    if (error.response.config) {
      delete error.response.config.data;
    }
    log.error(`Unexpected status code from ms-disc-query service, ${JSON.stringify(error, null, 2)}`);
    if (error.response.status !== 404) {
      throw error;
    }
  }
  return undefined;
};

module.exports = { getAccountData };
