const {
  mountURL,
} = require('../config/config-mapping');

const getChangeLinkCalculatorMonthChange = (claimType) => {
  const pageFieldMapping = {
    SW: {
      pageName: 'support-days',
      entryFieldName: 'dayOfSupport',
    },
    TW: {
      pageName: 'travel-days',
      entryFieldName: 'dayOfTravel',
    },
    TIW: {
      pageName: 'journey-number',
      entryFieldName: 'dateOfTravel',
    },
  };

  const supportedClaimTypes = Object.keys(pageFieldMapping);
  if (!supportedClaimTypes.includes(claimType)) {
    throw new Error(`Unsupported claimType: ${claimType}. The types supported at the moment are: ${supportedClaimTypes.join(', ')}`);
  }

  const calculateChangeLinkUrl = (key, index, inEditMode) => {
    if(claimType == 'TIW') {
      const daysYouHadSupportPageUrl = `${pageFieldMapping[claimType].pageName}?`;
      const changeLink = `changeMonthYear=${key}`;
      const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;

      return `${daysYouHadSupportPageUrl}${inEditMode
          ? `${refererUrl}&${changeLink}`
          : `${changeLink}`}`;

    } else {
      const daysYouHadSupportPageUrl = `${pageFieldMapping[claimType].pageName}?`;
      const changeLink = `changeMonthYear=${key}#f-day%5B${index}%5D%5B${pageFieldMapping[claimType].entryFieldName}%5D`;
      const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;


      return `${daysYouHadSupportPageUrl}${inEditMode
          ? `${refererUrl}&${changeLink}`
          : `${changeLink}`}`;
    }
  };
  return {
    calculateChangeLinkUrl,
  };
};

const getChangeLinkCalculatorItemChange = (claimType) => {
  const pageFieldMapping = {
    AV: {
      pageName: 'your-vehicle-adaptations',
      entryFieldName: 'description',
    },
    EA: {
      pageName: 'your-specialist-equipment',
      entryFieldName: 'description',
    }
  };
  const supportedClaimTypes = Object.keys(pageFieldMapping);
  if (!supportedClaimTypes.includes(claimType)) {
    throw new Error(`Unsupported claimType: ${claimType}. The types supported at the moment are: ${supportedClaimTypes.join(', ')}`);
  }
  const calculateChangeLinkUrl = (key, index, inEditMode) => {
    const daysYouHadSupportPageUrl = `${pageFieldMapping[claimType].pageName}?`;
    const changeLink = `changeClaim=${key}#f-item%5B${index}%5D%5B${pageFieldMapping[claimType].entryFieldName}%5D`;
    const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;
    return `${daysYouHadSupportPageUrl}${inEditMode
      ? `${refererUrl}&${changeLink}`
      : `${changeLink}`}`;
  };
  return {
    calculateChangeLinkUrl,
  };
};

const getRemoveLinkCalculator = (claimType) => {
  const pageFieldMapping = {
    AV: {
      pageName: 'remove-vehicle-adaptations',
      entryFieldName: 'description',
    },
    EA: {
      pageName: 'remove-specialist-equipments',
      entryFieldName: 'description',
    }
  };

  const supportedClaimTypes = Object.keys(pageFieldMapping);
  if (!supportedClaimTypes.includes(claimType)) {
    throw new Error(`Unsupported claimType: ${claimType}. The types supported at the moment are: ${supportedClaimTypes.join(', ')}`);
  }

  const calculateRemoveLinkUrl = (key, index, inEditMode) => {
    const removePageUrl = `${pageFieldMapping[claimType].pageName}?`;
    const removeLink = `remove=${key}#f-item%5B${index}%5D%5B${pageFieldMapping[claimType].entryFieldName}%5D`;
    const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;

    return `${removePageUrl}${inEditMode
      ? `${refererUrl}&${removeLink}`
      : `${removeLink}`}`;
  };
  return {
    calculateRemoveLinkUrl,
  };
};

const getBackLinkFromQueryParameter = (req) => {
  const { referrer } = req.query;
  return referrer.replace(/\/+/g, '/')
    .replace(/[.:]+/g, '');
};

const getRemoveLinkCalculatorMonthRemove = (claimType) => {
  const pageFieldMapping = {
    SW: {
      pageName: 'remove-support-month',
      dayEntryFieldName: 'dateOfSupport',
    },
    TIW: {
      pageName: 'remove-tiw-month',
      journeyEntryFieldName: 'dateOfTravel',
    },
    TW: {
      pageName: 'remove-travel-month',
      journeyEntryFieldName: 'dateOfTravel'
    }
  };

  const supportedClaimTypes = Object.keys(pageFieldMapping);
  if (!supportedClaimTypes.includes(claimType)) {
    throw new Error(`Unsupported claimType: ${claimType}. The types supported at the moment are: ${supportedClaimTypes.join(', ')}`);
  }

  const calculateRemoveLinkUrl = (key, index, inEditMode) => {
    if(claimType == 'TIW' || claimType == 'TW') {
      const removePageUrl = `${pageFieldMapping[claimType].pageName}?`;
      const removeLink = `remove=${key}#f-day%5B${index}%5D%5B${pageFieldMapping[claimType].journeyEntryFieldName}%5D`;
      const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;

      return `${removePageUrl}${inEditMode
          ? `${refererUrl}&${removeLink}`
          : `${removeLink}`}`;

    } else {
      const removePageUrl = `${pageFieldMapping[claimType].pageName}?`;
      const removeLink = `remove=${key}#f-day%5B${index}%5D%5B${pageFieldMapping[claimType].dayEntryFieldName}%5D`;
      const refererUrl = `edit&editorigin=${mountURL}check-your-answers`;

      return `${removePageUrl}${inEditMode
          ? `${refererUrl}&${removeLink}`
          : `${removeLink}`}`;
    }
  };
  return {
    calculateRemoveLinkUrl,
  };
};

module.exports = {
  getChangeLinkCalculatorMonthChange,
  getChangeLinkCalculatorItemChange,
  getRemoveLinkCalculator,
  getBackLinkFromQueryParameter,
  getRemoveLinkCalculatorMonthRemove,
};
