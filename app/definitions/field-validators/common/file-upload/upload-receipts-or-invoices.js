const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const {
  MaxFileSize,
  FileFormat,
} = require('../../../../custom-validators/file-validators');

const fieldValidators = {
  file: sf([
    MaxFileSize,
    FileFormat,
    r.required.make({
      errorMsg: {
        summary: 'upload-receipts-or-invoices:errors.required',
        inline: 'upload-receipts-or-invoices:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
