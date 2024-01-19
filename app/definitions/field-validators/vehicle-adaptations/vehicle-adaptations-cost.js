const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { CURRENCY } = require('../../../config/regex-definitions');

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
  ]),
};

module.exports = fieldValidators;
