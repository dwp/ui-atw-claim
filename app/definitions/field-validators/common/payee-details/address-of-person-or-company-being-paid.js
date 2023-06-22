const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { UPRN } = require('../../../../config/regex-definitions');

const fieldValidators = {
  uprn: sf([
    r.required.make({
      errorMsg: {
        summary: 'address-of-person-or-company-being-paid:select.errors.required',
        inline: 'address-of-person-or-company-being-paid:select.errors.required',
      },
    }),
    r.regex.make({
      pattern: UPRN,
      errorMsg: {
        summary: 'address-of-person-or-company-being-paid:select.errors.required',
        inline: 'address-of-person-or-company-being-paid:select.errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
