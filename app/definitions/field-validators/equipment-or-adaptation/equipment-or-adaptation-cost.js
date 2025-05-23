const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { CURRENCY, REJECT_ZERO_VALUES } = require('../../../config/regex-definitions');

const fieldValidators = {
  totalCost: sf([
    r.required.make({
      errorMsg: {
        summary: 'equipment-or-adaptation-cost:validation.required',
        inline: 'equipment-or-adaptation-cost:validation.required',
      },
    }),
    r.regex.make({
      pattern: CURRENCY,
      errorMsg: {
        summary: 'equipment-or-adaptation-cost:validation.invalid',
        inline: 'equipment-or-adaptation-cost:validation.invalid',
      },
    }),
    r.regex.make({
      pattern: REJECT_ZERO_VALUES,
      errorMsg: {
        summary: 'equipment-or-adaptation-cost:validation.zero',
        inline: 'equipment-or-adaptation-cost:validation.zero',
      },
    }),
  ]),
};

module.exports = fieldValidators;
