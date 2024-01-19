const createErrorMsg = require('../utils/create-error-message');
const logger = require('../../../logger/logger');
const {
  areAllDateFieldsEmpty,
  isDateInFuture,
  isDateValid,
  isValidYear,
} = require('../utils/date-validator-helpers');
const isDayValid = require('./day-date-validator');
const isMonthValid = require('./month-date-validator');
const isYearValid = require('./year-date-validator');

const log = logger('custom-validation:helper.date-validator');

function validateDateField(dd, mm, yyyy, errorKeyBase, dateFieldName, errorMessages, index) {
  const dayIdentifier = 'dd';
  const monthIdentifier = 'mm';
  const yearIdentifier = 'yyyy';

  const dateEntered = {
    dd,
    mm,
    yyyy,
  };

  // Ensure that all 3 fields are not empty
  if (areAllDateFieldsEmpty(dateEntered)) {
    log.debug('date required error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.required`,
      `[${index}][${dateFieldName}]`,
      `[${index}][${dateFieldName}][${dayIdentifier}]`,
    );
    return;
  }

  // Day Validation
  const dayErrorKey = isDayValid(dateEntered);
  if (dayErrorKey !== undefined) {
    log.debug('day missing error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.${dayErrorKey}.${dayIdentifier}`,
      `[${index}][${dateFieldName}]`,
      `[${index}][${dateFieldName}][${dayIdentifier}]`,
    );
    return;
  }

  // Month Validation
  const monthErrorKey = isMonthValid(dateEntered);
  if (monthErrorKey !== undefined) {
    log.debug('month missing error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.${monthErrorKey}.${monthIdentifier}`,
      `[${index}][${dateFieldName}]`,
      `[${index}][${dateFieldName}][${monthIdentifier}]`,
    );
    return;
  }

  // Year Validation
  const yearErrorKey = isYearValid(dateEntered);
  if (yearErrorKey !== undefined) {
    log.debug('year missing error');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.${yearErrorKey}.${yearIdentifier}`,
      `[${index}][${dateFieldName}]`,
      `[${index}][${dateFieldName}][${yearIdentifier}]`,
    );
    return;
  }

  if (!(isDateValid(dateEntered) && isValidYear(dateEntered))) {
    log.debug('invalid date');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.invalid.date`,
      `[${index}][${dateFieldName}]`,
      `[${index}][${dateFieldName}][${yearIdentifier}]`,
    );
  } else if (isDateInFuture(dateEntered)) {
    log.debug('date in future');
    createErrorMsg(
      errorMessages,
      index,
      `${errorKeyBase}.invalid.future`,
      `[${index}][${dateFieldName}]`,
      `[${index}][${dateFieldName}][${dayIdentifier}]`,
    );
  }
}

module.exports = validateDateField;
