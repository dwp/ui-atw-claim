const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { CURRENCY } = require('../../../config/regex-definitions');

const fieldValidators = {
  totalCost: sf([
    r.required.make({
      errorMsg: {
        summary: 'support-cost:validation.required',
        inline: 'support-cost:validation.required',
      },
    }),
    r.regex.make({
      pattern: CURRENCY,
      errorMsg: {
        summary: 'support-cost:validation.invalid',
        inline: 'support-cost:validation.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
