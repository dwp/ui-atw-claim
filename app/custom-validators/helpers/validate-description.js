const createErrorMessage = require('./utils/create-error-message');
const logger = require('../../logger/logger');

const log = logger('custom-validation:helper.validate-description');

function validateDescription(errorKeyBase, description, errorMessages, index) {
  const errorKeyDateOfDescription = `${errorKeyBase}.description`;

  if (description === undefined || description.length === 0) {
    log.debug('description error');
    createErrorMessage(
      errorMessages,
      index,
      `${errorKeyDateOfDescription}.required`,
      `[${index}][description]`,
      `[${index}][description]`,
    );
  }
}
module.exports = validateDescription;
