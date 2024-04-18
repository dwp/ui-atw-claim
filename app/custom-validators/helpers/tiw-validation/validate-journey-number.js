const createErrorMsg = require('../utils/tiw-create-error-message');
const logger = require('../../../logger/logger');
const isJourneyNumberValid = require('./validate-journey');

const log = logger('custom-validation:helper.date-validator');

function validateJourneyNumber(journeyNumber, errorMessages, dateData, index) {
  const errorKeyBase = 'journey-number:validation';
  const journeyFieldName = 'dateOfTravel';

  const errorKey = isJourneyNumberValid(journeyNumber);

  if (errorKey === 'required') {
    log.debug('journey number required error');
    createErrorMsg(
        errorMessages,
        index,
        dateData,
        `${errorKeyBase}.required`,
        `[${index}][${journeyFieldName}]`,
    );
    return;
  }

  if (errorKey === 'tooLarge') {
    log.debug('journey number too large error');
    createErrorMsg(
        errorMessages,
        index,
        dateData,
        `${errorKeyBase}.tooLarge`,
        `[${index}][${journeyFieldName}]`,
    );
    return;
  }

    if (errorKey !== undefined) {
      log.debug('journey number invalid error');
      createErrorMsg(
          errorMessages,
          index,
          dateData,
          `${errorKeyBase}.invalid`,
          `[${index}][${journeyFieldName}]`,
      );
      return;
    }

}

module.exports = validateJourneyNumber;
