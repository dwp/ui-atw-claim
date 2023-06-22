/* eslint-disable class-methods-use-this */

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const logger = require('../logger/logger');
const validateDescription = require('./helpers/validate-description');
const validateDateField = require('./helpers/date-field-validation/date-validator');

const log = logger('custom-validation:equipment-or-adaptation-list-validation');
const errorKeyBase = 'your-equipment-or-adaptation:validation';

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class EquipmentOrAdaptationsList extends ValidatorFactory {
  validate(items, dataContext = {}) {
    const errorMessages = [];
    Object.keys(items)
      .forEach((key) => {
        const index = parseInt(key, 10);
        const item = items[index];

        const dateEntered = item.dateOfPurchase;

        log.debug('Starting validation');
        validateDescription(errorKeyBase, item.description, errorMessages, index);
        log.debug('Finished running validateDescription for entry '
          + `${index}. current error count ${errorMessages.length}`);

        validateDateField(
          dateEntered.dd,
          dateEntered.mm,
          dateEntered.yyyy,
          'date-field-validation:dateOfPurchaseValidation',
          'dateOfPurchase',
          errorMessages,
          index,
        );
        log.debug('Finished running validateDateOfPurchase for entry '
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

module.exports = EquipmentOrAdaptationsList;
