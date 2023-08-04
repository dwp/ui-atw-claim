const { claimTypesShortName } = require('../config/claim-types');

/* eslint-disable no-param-reassign */
const formatNumericAttributesInClaim = (claim, attributeNamesToFormat) => {
  claim.forEach((day) => {
    attributeNamesToFormat.forEach((attribute) => {
      day[attribute] = parseFloat(day[attribute] ?? 0);
    });
  });
};

/**
 * Formats given attributes to numbers and returns a sum of an attribute in all claims.
 *
 * @param {*} allData - Object containing claims.
 * @param {string[]} attributeNamesToFormat - List of attribute names needing formatting to numbers.
 * @param {*} attributeToSum - Name of attribute which needs to be summed accross all claims.
 * @returns {number} Sum of all occurences of attributeToSum across claims.
 */
const sumUnNestedAttributeForClaim = (
  allData,
  attributeNamesToFormat,
  attributeToSum,
) => Object.values(allData).reduce((total, month) => {
  formatNumericAttributesInClaim(month.claim, attributeNamesToFormat);
  return month.claim.reduce((acc, curr) => acc + curr[attributeToSum], 0) + total;
}, 0);

const sumNestedAttributeForClaim = (allData, objectAttribute, attributeToSum) => Object.values(
  allData,
)
  .reduce((total, month) => month.claim.reduce(
    (acc, curr) => acc + curr[objectAttribute][attributeToSum],
    0,
  ) + total, 0);

const findIndexOfGivenMonth = (allData, userInput) => {
  for (const [key, value] of Object.entries(allData ?? [])) {
    if (parseFloat(value.monthYear.mm) === parseFloat(userInput.mm)
      && parseFloat(value.monthYear.yyyy) === parseFloat(userInput.yyyy)) {
      return key;
    }
  }

  return undefined;
};

const rollUpEnteredDaysForAClaim = (req, claimType) => {
  const pageFieldMapping = {
    [claimTypesShortName.SUPPORT_WORKER]: {
      dataPageName: 'support-days',
      dayEntryFieldName: 'dayOfSupport',
      valueEntryFieldName: 'timeOfSupport',
    },
    [claimTypesShortName.TRAVEL_TO_WORK]: {
      dataPageName: 'travel-days',
      dayEntryFieldName: 'dayOfTravel',
      valueEntryFieldName: 'totalTravel',
    },
  };
  const supportedClaimTypes = Object.keys(pageFieldMapping);
  if (!supportedClaimTypes.includes(claimType)) {
    throw new Error(
      `Unsupported claimType: ${claimType}. The types supported at the moment are: ${supportedClaimTypes.join(
        ', ',
      )}`,
    );
  }

  const { day } = req.casa.journeyContext.getDataForPage(pageFieldMapping[claimType].dataPageName);

  if (claimType === claimTypesShortName.SUPPORT_WORKER) {
    const rolledUpDayData = Object.values(day)
      .map((entry) => {
        const sanitisedEntry = { ...entry };
        sanitisedEntry[pageFieldMapping[claimType].valueEntryFieldName] = {
          hoursOfSupport: parseInt(
            entry[pageFieldMapping[claimType].valueEntryFieldName].hoursOfSupport || 0,
            10,
          ),
          minutesOfSupport: parseInt(
            entry[pageFieldMapping[claimType].valueEntryFieldName].minutesOfSupport || 0,
            10,
          ),
        };
        return sanitisedEntry;
      })
      .reduce((accumulator, entry) => {
        const alreadyScannedElements = accumulator.map(
          (dayData) => dayData[pageFieldMapping[claimType].dayEntryFieldName],
        );
        const indexOfDupedElement = alreadyScannedElements.findIndex(
          (scannedElement) => scannedElement
            === entry[pageFieldMapping[claimType].dayEntryFieldName],
        );

        if (indexOfDupedElement === -1) {
          accumulator.push(entry);
        } else {
          const rolledUpEntry = {
            ...accumulator[indexOfDupedElement],
          };
          rolledUpEntry[pageFieldMapping[claimType].valueEntryFieldName].hoursOfSupport
            += entry[pageFieldMapping[claimType].valueEntryFieldName].hoursOfSupport;
          rolledUpEntry[pageFieldMapping[claimType].valueEntryFieldName].minutesOfSupport
            += entry[pageFieldMapping[claimType].valueEntryFieldName].minutesOfSupport;
          accumulator[indexOfDupedElement] = rolledUpEntry;
        }
        return accumulator;
      }, []);
    return {
      day: rolledUpDayData,
    };
  }
  if (claimType === claimTypesShortName.TRAVEL_TO_WORK) {
    const rolledUpDayData = Object.values(day)
      .map((entry) => {
        const sanitisedEntry = { ...entry };
        sanitisedEntry[pageFieldMapping[claimType].valueEntryFieldName] = parseFloat(
          entry[pageFieldMapping[claimType].valueEntryFieldName],
        );
        return sanitisedEntry;
      })
      .reduce((accumulator, entry) => {
        const alreadyScannedElements = accumulator.map(
          (dayData) => dayData[pageFieldMapping[claimType].dayEntryFieldName],
        );
        const indexOfDupedElement = alreadyScannedElements.findIndex(
          (scannedElement) => scannedElement
            === entry[pageFieldMapping[claimType].dayEntryFieldName],
        );

        if (indexOfDupedElement === -1) {
          accumulator.push(entry);
        } else {
          const rolledUpEntry = {
            ...accumulator[indexOfDupedElement],
          };
          rolledUpEntry[pageFieldMapping[claimType].valueEntryFieldName]
            += entry[pageFieldMapping[claimType].valueEntryFieldName];
          accumulator[indexOfDupedElement] = rolledUpEntry;
        }
        return accumulator;
      }, []);
    return {
      day: rolledUpDayData,
    };
  }
  return undefined;
};

module.exports = {
  sumUnNestedAttributeForClaim,
  sumNestedAttributeForClaim,
  findIndexOfGivenMonth,
  rollUpEnteredDaysForAClaim,
};
