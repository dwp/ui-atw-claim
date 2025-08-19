 

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const logger = require('../logger/logger');
const validateTimeField = require('./helpers/hour-minute-field-validation/time-validator');

const log = logger('custom-validation:support-worker-time-validation');

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class SupportWorkerTimeValidation extends ValidatorFactory {
  validate(items, dataContext) {
      const dateData = dataContext.journeyContext.getDataForPage('support-days').daysOfSupport;
      const errorMessages = [];
      const monthData = dataContext.journeyContext.getDataForPage('support-month');

    Object.keys(items)
      .forEach((key) => {
        const index = parseInt(key, 10);
        const item = items[index];

        log.debug('Starting validation');

        const { hoursOfSupport, minutesOfSupport } = item.timeOfSupport;

        validateTimeField(
          hoursOfSupport,
          minutesOfSupport,
          errorMessages,
            dateData,
            index,
        );

        log.debug('Finished running validateTimeField for entry '
          + `${index}. current error count ${errorMessages.length}`);
      });

    Object.keys(errorMessages)
        .forEach((key) => {
            const index = parseInt(key, 10);
            const message = errorMessages[index];

            if (dataContext.journeyContext.nav.language === 'cy') {
              message.variables.dateKey = new Date(monthData.dateOfSupport.yyyy, monthData.dateOfSupport.mm -1, message.variables.dateKey).toLocaleDateString('cy', {weekday: "long", day:"numeric", month:"long"}).replace(',', '');
            } else {
              message.variables.dateKey = new Date(monthData.dateOfSupport.yyyy, monthData.dateOfSupport.mm -1, message.variables.dateKey).toLocaleDateString('en-GB', {weekday: "long", day:"numeric", month:"long"}).replace(',', '');
            }

        })

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

module.exports = SupportWorkerTimeValidation;
