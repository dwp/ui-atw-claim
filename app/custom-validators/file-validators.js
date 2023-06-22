const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const logger = require('../logger/logger');

const log = logger('custom-validation:file-validators');

const errorHandler = (dataContext, errorMessage) => {
  dataContext.journeyContext.setDataForPage(dataContext.waypointId, {});
  return Promise.reject(
    new ValidationError({
      summary: errorMessage,
    }),
  );
};

module.exports = {
  FileFormat: async (value, dataContext) => {
    log.debug('Running file format custom validator');
    const { isInvalidMimeType } = dataContext.journeyContext.getDataForPage(
      dataContext.waypointId,
    );
    if (isInvalidMimeType) {
      log.debug('The selected file has invalid mime type');
      return errorHandler(dataContext, 'upload-receipts-or-invoices:errors.invalidType');
    }
    return true;
  },
  MaxFileSize: async (value, dataContext) => {
    log.debug('Running max file size custom validator');
    const { isFileLimitExceeded } = dataContext.journeyContext.getDataForPage(
      dataContext.waypointId,
    );
    if (isFileLimitExceeded) {
      log.debug('The selected file is bigger than limit');
      const msg = 'upload-receipts-or-invoices:errors.tooLarge';
      return errorHandler(dataContext, msg);
    }
    return true;
  },
};
