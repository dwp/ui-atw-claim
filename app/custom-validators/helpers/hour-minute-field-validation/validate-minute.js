const {
  isTimeWholeNumber,
  isTimeNonNumeric,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.validate-hour');

function isMinuteValid(minutesOfSupport) {
  if (minutesOfSupport > 59) {
    log.debug('minute too large error');
    return 'tooLarge';
  }
  if (minutesOfSupport < 0) {
    log.debug('minute too small error');
    return 'tooSmall';
  }
  if (isTimeNonNumeric(minutesOfSupport)) {
    log.debug('minute not numeric error');
    return 'nonNumeric';
  }
  if (!(isTimeWholeNumber(minutesOfSupport))) {
    log.debug('minute decimal error');
    return 'improperDecimalValue';
  }
  return undefined;
}

module.exports = isMinuteValid;
