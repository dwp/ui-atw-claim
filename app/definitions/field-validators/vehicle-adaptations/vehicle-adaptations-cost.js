const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { CURRENCY, REJECT_ZERO_VALUES } = require('../../../config/regex-definitions');

const fieldValidators = {
  totalCost: sf([
    r.required.make({
      errorMsg: {
        summary: 'vehicle-adaptations-cost:validation.required',
        inline: 'vehicle-adaptations-cost:validation.required',
      },
    }),
    r.regex.make({
      pattern: CURRENCY,
      errorMsg: {
        summary: 'vehicle-adaptations-cost:validation.invalid',
        inline: 'vehicle-adaptations-cost:validation.invalid',
      },
    }),
    r.regex.make({
      pattern: REJECT_ZERO_VALUES,
      errorMsg: {
        summary: 'vehicle-adaptations-cost:validation.zero',
        inline: 'vehicle-adaptations-cost:validation.zero',
      },
    }), 
  ]),
};

module.exports = fieldValidators;
