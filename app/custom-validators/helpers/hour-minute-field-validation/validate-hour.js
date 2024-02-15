const {
  isTimeWholeNumber,
  isTimeNonNumeric,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.validate-hour');

function isHourValid(hoursOfSupport) {
  if (hoursOfSupport.length == 0) {
    log.debug('hour required error');
    return 'required';
  }
  if (hoursOfSupport > 24) {
    log.debug('hour too large error');
    return 'tooLarge';
  }
  if (hoursOfSupport < 0) {
    log.debug('hour too small error');
    return 'tooSmall';
  }
  if (isTimeNonNumeric(hoursOfSupport)) {
    log.debug('hour not numeric error');
    return 'nonNumeric';
  }
  if (!(isTimeWholeNumber(hoursOfSupport))) {
    log.debug('hour decimal error');
    return 'improperDecimalValue';
  }
  return undefined;
}

module.exports = isHourValid;
