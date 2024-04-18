const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const logger = require('../logger/logger');
const { claimTypesFullName } = require('../config/claim-types');

const log = logger('custom-validation:file-list-validators');

const errorHandler = (dataContext, errorMessage) => {
  dataContext.journeyContext.setDataForPage(dataContext.waypointId, {});
  return Promise.reject(
    new ValidationError({
      summary: errorMessage,
    }),
  );
};

module.exports = {
  FileList: async (value, dataContext) => {
    log.debug('running file format custom validator');
    const { files } = dataContext.journeyContext.getDataForPage('__hidden_uploaded_files__');
    const { uploadMore } = dataContext.journeyContext.getDataForPage('receipts-invoices-uploaded');
    const { journeyType } = dataContext.journeyContext.getDataForPage('__journey_type__');

    if (uploadMore === 'no' && files !== undefined && files.length === 0) { 
      if (journeyType === claimTypesFullName.EA || journeyType === claimTypesFullName.AV || 
          journeyType === claimTypesFullName.SW || journeyType === claimTypesFullName.TW || 
          journeyType === claimTypesFullName.TIW) {
            return errorHandler(dataContext, 'receipts-or-invoices-uploaded:validation.noFiles');
      }
      throw Error(`Unsupported journey type ${journeyType}`);
    }
    return true;
  },
};
