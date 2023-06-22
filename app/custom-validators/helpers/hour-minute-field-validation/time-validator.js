const createErrorMsg = require('../utils/create-error-message');
const logger = require('../../../logger/logger');
const isHourValid = require('./validate-hour');
const isMinuteValid = require('./validate-minute');

const log = logger('custom-validation:helper.date-validator');

function validateTimeField(hoursOfSupport, minutesOfSupport, errorMessages, index) {
  const hourIdentifier = 'hoursOfSupport';
  const minutesIdentifier = 'minutesOfSupport';
  const errorKeyBase = 'days-you-had-support:validation';
  const timeFieldName = 'timeOfSupport';

  const hourErrorKey = isHourValid(hoursOfSupport);
  const minuteErrorKey = isMinuteValid(minutesOfSupport);

  if (hourErrorKey !== undefined && minuteErrorKey !== undefined) {
    log.debug('hour and minute missing error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.invalid`,
      `[${index}][${timeFieldName}]`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
    return;
  }

  if (hourErrorKey !== undefined) {
    log.debug('hour missing error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.${hourErrorKey}.${hourIdentifier}`,
      `[${index}][${timeFieldName}]`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
    return;
  }

  if (minuteErrorKey !== undefined) {
    log.debug('minute missing error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.${minuteErrorKey}.${minutesIdentifier}`,
      `[${index}][${timeFieldName}]`,
      `[${index}][${timeFieldName}][${minutesIdentifier}]`,
    );
    return;
  }

  const hoursOfSupportInt = parseInt(hoursOfSupport, 10) || 0;
  const minutesOfSupportInt = parseInt(minutesOfSupport, 10) || 0;

  if (hoursOfSupportInt === 24 && minutesOfSupportInt > 0) {
    log.debug('hours too large error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.tooLarge.${hourIdentifier}`,
      `[${index}][${timeFieldName}]`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
  }

  if (hoursOfSupportInt + minutesOfSupportInt === 0) {
    log.debug('hours or minutes required error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.required`,
      `[${index}][${timeFieldName}]`,
      `[${index}][${timeFieldName}][${hourIdentifier}]`,
    );
  }
}

module.exports = validateTimeField;
