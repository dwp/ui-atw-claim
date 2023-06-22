const {
  mountURL,
} = require('../config/config-mapping');

const getChangeLinkCalculator = (claimType) => {
  const pageFieldMapping = {
    SW: {
      pageName: 'days-you-had-support',
      dayEntryFieldName: 'dayOfSupport',
    },
    TW: {
      pageName: 'days-you-travelled-for-work',
      dayEntryFieldName: 'dayOfTravel',
    },
  };

  const supportedClaimTypes = Object.keys(pageFieldMapping);
  if (!supportedClaimTypes.includes(claimType)) {
    throw new Error(`Unsupported claimType: ${claimType}. The types supported at the moment are: ${supportedClaimTypes.join(', ')}`);
  }

  const calculateChangeLinkUrl = (key, index, inEditMode) => {
    const daysYouHadSupportPageUrl = `${pageFieldMapping[claimType].pageName}?`;
    const changeLink = `changeMonthYear=${key}#f-day%5B${index}%5D%5B${pageFieldMapping[claimType].dayEntryFieldName}%5D`;
    const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;

    return `${daysYouHadSupportPageUrl}${inEditMode
      ? `${refererUrl}&${changeLink}`
      : `${changeLink}`}`;
  };
  return {
    calculateChangeLinkUrl,
  };
};

const getBackLinkFromQueryParameter = (req) => {
  const { referrer } = req.query;
  return referrer.replace(/\/+/g, '/')
    .replace(/[.:]+/g, '');
};

module.exports = {
  getChangeLinkCalculator,
  getBackLinkFromQueryParameter,
};
