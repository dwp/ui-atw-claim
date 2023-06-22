const {
  isYearNonNumeric,
  isYearFieldEmpty,
} = require('../utils/date-validator-helpers');
const logger = require('../../../logger/logger');

const log = logger('custom-validation:helper.year-date-validator');

function isYearValid(dateOfPurchase) {
  if (isYearFieldEmpty(dateOfPurchase)) {
    log.debug('day missing error');
    return 'missing';
  } if (isYearNonNumeric(dateOfPurchase)) {
    log.debug('non-numeric day error');
    return 'nonNumeric';
  }
  return undefined;
}

module.exports = isYearValid;
