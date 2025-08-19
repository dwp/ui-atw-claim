 

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const logger = require('../logger/logger');
const validateDescription = require('./helpers/validate-description');
const validateDateField = require('./helpers/date-field-validation/date-validator');

const log = logger('custom-validation:vehicle-adaptations-list-validation');
const errorKeyBase = 'your-vehicle-adaptations:validation';

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class VehicleAdaptationsList extends ValidatorFactory {
	validate(items, dataContext = {}) {
		const errorMessages = [];
		Object.keys(items)
			.forEach((key) => {
				const index = parseInt(key, 10);
				const item = items[index];

				const dateEntered = item.dateOfInvoice;

				log.debug('Starting validation');
				validateDescription(errorKeyBase, item.description, errorMessages, index);
				log.debug('Finished running validateDescription for AV. '
					+ `Current error count ${errorMessages.length}`);

				validateDateField(
					dateEntered.dd,
					dateEntered.mm,
					dateEntered.yyyy,
					'date-field-validation:dateOfInvoiceValidation',
					'dateOfInvoice',
					errorMessages,
					index
				);
				log.debug('Finished running validateDateOfInvoice for AV. '
					+ `Current error count ${errorMessages.length}`);
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

module.exports = VehicleAdaptationsList;
