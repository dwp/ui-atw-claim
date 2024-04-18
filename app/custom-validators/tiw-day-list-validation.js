/* eslint-disable class-methods-use-this */

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const logger = require('../logger/logger');
const validateJourneyNumber = require('./helpers/tiw-validation/validate-journey-number');

const log = logger('custom-validation:travel-list-validation');

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class TravelListValidation extends ValidatorFactory {
  validate(items, dataContext) {
    const monthData = dataContext.journeyContext.getDataForPage('travel-claim-month').dateOfTravel;
    const errorMessages = [];
    let dayAndJourneyList = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].dateOfTravel != "") {
        const daysOfTravel = {
          index: i,
          value: items[i].dateOfTravel
        };
        dayAndJourneyList.push(daysOfTravel);
      };
    };


    Object.keys(dayAndJourneyList)
    .forEach((key) => {
      const index = parseInt(key, 10);
      const item = dayAndJourneyList[index];

      log.debug('Starting validation');

      const journeyNumber = item.value;
      const dateData = item.index + 1;
      const fieldIndex = item.index;

      validateJourneyNumber(
          journeyNumber,
        errorMessages,
        dateData,
        fieldIndex,
      );

      log.debug('Finished running validateTimeField for entry '
        + `${index}. current error count ${errorMessages.length}`);
    });


    Object.keys(errorMessages)
        .forEach((key) => {
          const index = parseInt(key, 10);
          const message = errorMessages[index];

          message.variables.dateKey = new Date(monthData.yyyy, monthData.mm -1, message.variables.dateKey).toLocaleDateString('en-GB', {weekday: "long", day:"numeric", month:"long"}).replace(',', '');

        })

    if (dayAndJourneyList.length == 0) {
      log.debug("no values entered, return required error");

      const journeyNumber = dayAndJourneyList;
      const dateData = 0;
      const index = 0;

      validateJourneyNumber(
          journeyNumber,
          errorMessages,
          dateData,
          index,
      );

    };


    // Errors found
    if (errorMessages.length > 0) {
      const errorGroup = errorMessages.map((errorsMessage) => (
          ValidationError.make({
            errorMsg: errorsMessage,
            dataContext,
          })
      ));
      return Promise.reject(errorGroup);
    }
    // No errors found
    return Promise.resolve();
  }
}

module.exports = TravelListValidation;
