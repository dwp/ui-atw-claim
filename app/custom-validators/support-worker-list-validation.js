 

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const logger = require('../logger/logger');
const validateDateField = require('./helpers/date-field-validation/date-validator');
const validateTimeField = require('./helpers/hour-minute-field-validation/time-validator');
const createErrorMsg = require('./helpers/utils/create-error-message');

const log = logger('custom-validation:support-worker-list-validation');

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class SupportWorkerListValidation extends ValidatorFactory {
  validate(items, dataContext) {
    const monthData = dataContext.journeyContext
      .getDataForPage('support-month').dateOfSupport;

    const errorMessages = [];

    Object.keys(items)
      .forEach((key) => {
        const index = parseInt(key, 10);
        const item = items[index];

        log.debug('Starting validation');

        const errorKeyBase = 'date-field-validation:dayOfSupportValidation';
        const dateFieldName = 'dayOfSupport';
        if (item.dayOfSupport.length === 0) {
          createErrorMsg(
            errorMessages,
            index,
            `${errorKeyBase}.required`,
            `[${index}][${dateFieldName}]`,
            `[${index}][${dateFieldName}][dd}]`,
          );
        } else {
          validateDateField(
            item.dayOfSupport,
            monthData.mm,
            monthData.yyyy,
            errorKeyBase,
            dateFieldName,
            errorMessages,
            index,
          );
        }

        log.debug('Finished running validateDateOfSupport for entry '
          + `${index}. current error count ${errorMessages.length}`);

        const { hoursOfSupport, minutesOfSupport } = item.timeOfSupport;

        validateTimeField(
          hoursOfSupport,
          minutesOfSupport,
          errorMessages,
          index,
        );

        log.debug('Finished running validateTimeField for entry '
          + `${index}. current error count ${errorMessages.length}`);
      });

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

module.exports = SupportWorkerListValidation;
