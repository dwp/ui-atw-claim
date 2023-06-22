const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const {
  FileList,
} = require('../../../../custom-validators/file-list-validators');

const fieldValidators = {
  uploadMore: sf([
    r.required.make({
      errorMsg: {
        summary: 'receipts-or-invoices-uploaded:validation.required',
        inline: 'receipts-or-invoices-uploaded:validation.required',
      },
    }),
    FileList,
  ], ({
    journeyContext,
  }) => journeyContext.getDataForPage('remove-receipt-or-invoice')?.removeId === undefined),
};

module.exports = fieldValidators;
