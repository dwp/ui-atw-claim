const {
  isDayFieldEmpty,
  isDayNonNumeric,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.day-date-validator');

function isDayValid(dateEntered) {
  if (isDayFieldEmpty(dateEntered)) {
    log.debug('day missing error');
    return 'missing';
  } if (isDayNonNumeric(dateEntered)) {
    log.debug('non-numeric day error');
    return 'nonNumeric';
  } if (dateEntered.dd.toString().includes('.')) {
    log.debug('day not integer error');
    return 'nonNumeric';
  } if (dateEntered.dd > 31) {
    log.debug('invalid dd error');
    return 'invalid';
  }
  return undefined;
}

module.exports = isDayValid;
