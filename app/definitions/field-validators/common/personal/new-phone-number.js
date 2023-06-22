const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { PHONE_NUMBER } = require('../../../../config/regex-definitions');

const fieldValidators = {
  homeNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'new-phone-number:inputs.homeNumber.errors.required',
        inline: 'new-phone-number:inputs.homeNumber.errors.required',
      },
    }),
    r.regex.make({
      pattern: PHONE_NUMBER,
      errorMsg: {
        summary: 'new-phone-number:inputs.homeNumber.errors.invalid',
        inline: 'new-phone-number:inputs.homeNumber.errors.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
