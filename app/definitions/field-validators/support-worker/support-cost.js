const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { CURRENCY, REJECT_ZERO_VALUES } = require('../../../config/regex-definitions');

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
    r.regex.make({
      pattern: REJECT_ZERO_VALUES,
      errorMsg: {
        summary: 'support-cost:validation.zero',
        inline: 'support-cost:validation.zero',
      },
    }),
  ]),
};

module.exports = fieldValidators;
