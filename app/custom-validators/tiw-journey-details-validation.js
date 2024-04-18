/* eslint-disable class-methods-use-this */

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const logger = require('../logger/logger');
const validateInputFields = require('./helpers/tiw-validation/validate-input-fields');
const log = logger('custom-validation:tiw-journey-details-validation');

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class TiwJourneyDetailsValidation extends ValidatorFactory {
	validate(items, dataContext = {}) {
        const days = dataContext.journeyContext.getDataForPage('travel-claim-days');
        const monthYear = dataContext.journeyContext.getDataForPage('travel-claim-month').dateOfTravel;
		const errorMessages = [];

        const inputFields = [];
        Object.keys(items)
            .forEach((key) => {
            const index = parseInt(key, 10);
            const item = items[index];
            inputFields.push(item);
        });

        log.debug('Starting validation');
        for(let i = 0; i < days.length; i++) {
            let journey = 0;
            for (let j = 0; j < days[i].journeyNumber; j++) {
                validateInputFields(
                  inputFields[i][j].startPostcode,
                  inputFields[i][j].endPostcode,
                  inputFields[i][j].totalCost,
                    errorMessages,
                    days[i],
                    i,
                    journey);
                journey++;
            }
        }

        log.debug('Finished running validation of journey details for TIW. '
        + `Current error count ${errorMessages.length}`);

        Object.keys(errorMessages)
        .forEach((key) => {
            const index = parseInt(key, 10);
            const message = errorMessages[index];

            message.variables.dateKey = new Date(monthYear.yyyy, monthYear.mm -1, message.variables.dateKey.indexDay).toLocaleDateString('en-GB', {weekday: "long", day:"numeric", month:"long"}).replace(',', '');
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

module.exports = TiwJourneyDetailsValidation;
