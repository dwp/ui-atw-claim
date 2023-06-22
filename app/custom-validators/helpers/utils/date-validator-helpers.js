const { DateTime } = require('luxon');
const regex = require('../../../config/regex-definitions');

function areAllDateFieldsEmpty(date) {
  return (date.dd.length
    + date.mm.length
    + date.yyyy.length) === 0;
}

function isDayFieldEmpty(date) {
  return (date.dd.length) === 0;
}
function isMonthFieldEmpty(date) {
  return (date.mm.length) === 0;
}
function isYearFieldEmpty(date) {
  return (date.yyyy.length) === 0;
}

function isDateInFuture(date) {
  return DateTime.local(
    parseInt(date.yyyy, 10),
    parseInt(date.mm, 10),
    parseInt(date.dd, 10),
  ) > DateTime.now()
    .startOf('day');
}

function isDateValid(date) {
  return DateTime.local(
    parseInt(date.yyyy, 10),
    parseInt(date.mm, 10),
    parseInt(date.dd, 10),
  ).isValid;
}

function isNonNumeric(value) {
  return regex.NON_NUMERIC.test(value);
}
function isValidYear(date) {
  return date.yyyy.match(regex.YEAR);
}

function isYearNonNumeric(date) {
  return isNonNumeric(date.yyyy);
}
function isMonthNonNumeric(date) {
  return isNonNumeric(date.mm);
}
function isDayNonNumeric(date) {
  return isNonNumeric(date.dd);
}

function isTimeNonNumeric(value) {
  return isNonNumeric(value);
}

function getValueOrUndefinedIfEmpty(value) {
  if (value === '') {
    return undefined;
  }
  return (value);
}

function isNumericNoDecimal(value) {
  return regex.NUMBER_REGEX.test(value);
}

function isDayNumberInteger(value) {
  return isNumericNoDecimal(value);
}

function isTimeWholeNumber(value) {
  return isNumericNoDecimal(value);
}

module.exports = {
  areAllDateFieldsEmpty,
  isDayFieldEmpty,
  isMonthFieldEmpty,
  isYearFieldEmpty,
  isDateInFuture,
  isDateValid,
  isDayNonNumeric,
  isMonthNonNumeric,
  isYearNonNumeric,
  isValidYear,
  getValueOrUndefinedIfEmpty,
  isTimeNonNumeric,
  isDayNumberInteger,
  isTimeWholeNumber,
};
