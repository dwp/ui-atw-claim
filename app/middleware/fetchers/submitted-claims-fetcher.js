const axios = require('axios');
const {
  claimSubmission,
} = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('fetchers:submitted-claims');

const getSubmittedClaims = async (nino, awardType) => {
  const endpointUrl = `${claimSubmission.url}/claims-for-nino-and-type`;

  log.debug(`Trying to get submitted claims from: ${endpointUrl}`);

  try {
    const result = await axios({
      method: 'post',
      url: endpointUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        nino,
        claimType: awardType,
      },
    });
    return result.data;
  } catch (error) {
    if (error.response.status !== 404) {
      log.error(`Error getting claims history for nino and ${awardType}`);
      log.error(error);
      throw error;
    } else {
      log.debug(`No claims history for nino and ${awardType}`);
    }
  }
  return undefined;
};

module.exports = { getSubmittedClaims };
