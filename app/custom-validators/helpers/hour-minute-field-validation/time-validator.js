const createErrorMsg = require('../utils/sw-create-error-message');
const logger = require('../../../logger/logger');
const isHourValid = require('./validate-hour');
const isMinuteValid = require('./validate-minute');

const log = logger('custom-validation:helper.date-validator');

function validateTimeField(hoursOfSupport, minutesOfSupport, errorMessages, dateData, index) {
  const hourIdentifier = 'hoursOfSupport';
  const minutesIdentifier = 'minutesOfSupport';
  const errorKeyBase = 'hours-you-had-support:validation';
  const timeFieldName = 'timeOfSupport';

  const hourErrorKey = isHourValid(hoursOfSupport);
  const minuteErrorKey = isMinuteValid(minutesOfSupport);

  if (hourErrorKey === 'nonNumeric' && minuteErrorKey === 'nonNumeric') {
    log.debug('hour and minute missing error');
    createErrorMsg(
        errorMessages,
        index,
        dateData,
        `${errorKeyBase}.nonNumeric`,
        `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
    return;
  }

  if (hourErrorKey !== undefined && minuteErrorKey !== undefined) {
    log.debug('hour and minute missing error');
    createErrorMsg(
      errorMessages,
      index,
      dateData,
      `${errorKeyBase}.invalid`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
    return;
  }

  if (hourErrorKey !== undefined) {
    log.debug('hour missing error');
    createErrorMsg(
      errorMessages,
      index,
      dateData,
      `${errorKeyBase}.${hourErrorKey}.${hourIdentifier}`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
    return;
  }

  if (minuteErrorKey !== undefined) {
    log.debug('minute missing error');
    createErrorMsg(
      errorMessages,
      index,
      dateData,
      `${errorKeyBase}.${minuteErrorKey}.${minutesIdentifier}`,
      `[${index}][${timeFieldName}][${minutesIdentifier}]`,
    );
    return;
  }

  const hoursOfSupportInt = parseInt(hoursOfSupport, 10) || 0;
  const minutesOfSupportInt = parseInt(minutesOfSupport, 10) || 0;

  if (hoursOfSupportInt.length === 0 && minutesOfSupportInt > 0) {
    log.debug('hours too large error');
    createErrorMsg(
        errorMessages,
        index,
        dateData,
        `${errorKeyBase}.tooLarge.${hourIdentifier}`,
        `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
  }

  if (hoursOfSupportInt === 24 && minutesOfSupportInt > 0) {
    log.debug('hours too large error');
    createErrorMsg(
      errorMessages,
      index,
      dateData,
      `${errorKeyBase}.tooLarge.${hourIdentifier}`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
  }

  if (hoursOfSupportInt + minutesOfSupportInt === 0) {
    log.debug('hours or minutes required error');
    createErrorMsg(
      errorMessages,
      index,
      dateData,
      `${errorKeyBase}.required`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
  }
}

module.exports = validateTimeField;
