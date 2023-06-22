const {
  isMonthNonNumeric,
  isMonthFieldEmpty,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.month-date-validator');

function isMonthValid(dateOfPurchase) {
  if (isMonthFieldEmpty(dateOfPurchase)) {
    log.debug('day missing error');
    return 'missing';
  } if (isMonthNonNumeric(dateOfPurchase)) {
    log.debug('non-numeric day error');
    return 'nonNumeric';
  } if (dateOfPurchase.mm > 12) {
    log.debug('invalid dd error');
    return 'invalid';
  }
  return undefined;
}

module.exports = isMonthValid;
