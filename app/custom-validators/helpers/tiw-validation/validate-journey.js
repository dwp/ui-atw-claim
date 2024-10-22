const {
  isTimeWholeNumber,
  isTimeNonNumeric,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.validate-hour');

function isJourneyNumberValid(journeyNumber) {
  if (journeyNumber.length == 0) {
    log.debug('journey number required error');
    return 'required';
  }
  if (journeyNumber > 20) {
    log.debug('hour too large error');
    return 'tooLarge';
  }
  if (journeyNumber <= 0) {
    log.debug('hour too small error');
    return 'tooSmall';
  }
  if (isTimeNonNumeric(journeyNumber)) {
    log.debug('hour not numeric error');
    return 'nonNumeric';
  }
  if (!(isTimeWholeNumber(journeyNumber))) {
    log.debug('hour decimal error');
    return 'improperDecimalValue';
  }
  return undefined;
}

module.exports = isJourneyNumberValid;
