const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const regexDefinitions = require('../../../../config/regex-definitions');

const fieldValidators = {
  postcode: sf([
    r.required.make({
      errorMsg: {
        inline: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.required',
        summary: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.required',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.POSTCODE,
      errorMsg: {
        inline: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.invalid',
        summary: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.invalid',
      },
    }),

  ]),
};
module.exports = fieldValidators;
