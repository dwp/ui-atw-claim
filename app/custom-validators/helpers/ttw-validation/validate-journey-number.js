const createErrorMsg = require('../utils/ttw-create-error-message');
const logger = require('../../../logger/logger');
const isJourneyNumberValid = require('./validate-ttw-journey');

const log = logger('custom-validation:helper.date-validator');

function validateJourneyNumber(journeyNumber, errorMessages, dateData, index, dataContext) {
  const showMileageErrors = dataContext.journeyContext.getDataForPage('journeys-miles')?.journeysOrMileage;
  let errorKeyBase;

  if (showMileageErrors == 'journeys') {
    errorKeyBase = 'days-you-travelled-for-work:validation.totalTravel.journeys';
  } else if (showMileageErrors == 'mileage') {
    errorKeyBase = 'days-you-travelled-for-work:validation.totalTravel.mileage';
  } else {
    errorKeyBase = 'days-you-travelled-for-work:validation.totalTravel.taxi';
  }

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

  if (errorKey === 'tooSmall') {
    log.debug('journey number too small error');
    createErrorMsg(
        errorMessages,
        index,
        dateData,
        `${errorKeyBase}.tooSmall`,
        `[${index}][${journeyFieldName}]`,
    );
    return;
  }

  if (errorKey === 'improperDecimalValue') {
    log.debug('journey number decimal error');
    createErrorMsg(
        errorMessages,
        index,
        dateData,
        `${errorKeyBase}.improperDecimalValue`,
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
