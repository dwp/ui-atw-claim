const { ValidationError } = require('@dwp/govuk-casa');

/**
 * @param  {string} value Sortcode object can be 000000, 00-00-00, 00 00 00.
 */

function sortCodeValidator(value) {
  const regexSortCode = /^\d{2}([- ]?)\d{2}([- ]?)\d{2}$/;
  let valid = false;
  let error = this.errorMsg;

  if (typeof value === 'string') {
    if (value.length < 6 || value.length > 8) {
      error = this.invalidLengthErrorMsg;
    } else {
      valid = regexSortCode.test(value);
    }
  }

  const errorMsg = error || {
    inline: 'validation:rule.sortCode.inline',
    summary: 'validation:rule.sortCode.summary',
  };

  return valid ? Promise.resolve() : Promise.reject(ValidationError.make({ errorMsg }));
}

module.exports = sortCodeValidator;
