const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { PHONE_NUMBER } = require('../../../../config/regex-definitions');

const fieldValidators = {
  mobileNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'new-mobile-number:inputs.mobileNumber.errors.required',
        inline: 'new-mobile-number:inputs.mobileNumber.errors.required',
      },
    }),
    r.regex.make({
      pattern: PHONE_NUMBER,
      errorMsg: {
        summary: 'new-mobile-number:inputs.mobileNumber.errors.invalid',
        inline: 'new-mobile-number:inputs.mobileNumber.errors.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
