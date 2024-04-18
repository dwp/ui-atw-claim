const createErrorMessage = require('../utils/tiw-create-error-message');
const logger = require('../../../logger/logger');
const log = logger('custom-validation:helper.validate-input-fields');
const regex = require('../../../config/regex-definitions');

function validateInputFields(startPostcode, endPostcode, totalCost, errorMessages, day, i, index) {
  const errorKeyBase = 'journey-details:errors';
  const startPostcodeField = 'startPostcode';
  const endPostcodeField = 'endPostcode';
  const totalCostField = 'totalCost';

  if (startPostcode === undefined || startPostcode.length === 0) {
    log.debug('TiW: Journey details - startPostcode error');
    createErrorMessage(
      errorMessages,
      index,
      day,
      `${errorKeyBase}.startPostcode.required`,
      `[${i}][${index}][${startPostcodeField}]`,
    );
  }
  if (regex.SPECIAL_CHARACTERS.test(startPostcode)) {
    log.debug('TiW: Journey details - invalid start postcode error');
    createErrorMessage(
      errorMessages,
      index,
      day,
      `${errorKeyBase}.startPostcode.invalid`,
      `[${i}][${index}][${startPostcodeField}]`,
    );
  }
  if (endPostcode === undefined || endPostcode.length === 0) {
    log.debug('TiW: Journey details - endPostcode error');
    createErrorMessage(
      errorMessages,
      index,
      day,
      `${errorKeyBase}.endPostcode.required`,
      `[${i}][${index}][${endPostcodeField}]`,
    );
  }
  if (regex.SPECIAL_CHARACTERS.test(endPostcode)) {
    log.debug('TiW: Journey details - invalid start postcode error');
    createErrorMessage(
      errorMessages,
      index,
      day,
      `${errorKeyBase}.endPostcode.invalid`,
      `[${i}][${index}][${endPostcodeField}]`,
    );
  }
  if (totalCost === undefined || totalCost.length === 0) {
    log.debug('TiW: Journey details - totalCost error');
    createErrorMessage(
      errorMessages,
      index,
      day,
      `${errorKeyBase}.totalCost.required`,
      `[${i}][${index}][${totalCostField}]`,
    );
  }
  if (regex.NON_NUMERIC.test(totalCost)) {
    log.debug('TiW: Journey details - invalid totalCost error');
    createErrorMessage(
      errorMessages,
      index,
      day,
      `${errorKeyBase}.totalCost.invalid`,
      `[${i}][${index}][${totalCostField}]`,
    );
  }
}
module.exports = validateInputFields;
