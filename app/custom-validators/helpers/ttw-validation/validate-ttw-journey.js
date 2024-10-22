const {
  isTimeWholeNumber,
  isTimeNonNumeric,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.validate-hour');

function isJourneyNumberValid(journeyNumber) {
  if (journeyNumber.length == 0) {
    log.debug('number required error');
    return 'required';
  }
  if (journeyNumber <= 0) {
    log.debug('number too small error');
    return 'tooSmall';
  }
  if (isTimeNonNumeric(journeyNumber)) {
    log.debug('number not numeric error');
    return 'nonNumeric';
  }
  if (!(isTimeWholeNumber(journeyNumber))) {
    log.debug('number decimal error');
    return 'improperDecimalValue';
  }
  return undefined;
}

module.exports = isJourneyNumberValid;
