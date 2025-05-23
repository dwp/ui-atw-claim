const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { CURRENCY, REJECT_ZERO_VALUES } = require('../../../config/regex-definitions');

const fieldValidators = {
  totalCost: sf([
    r.required.make({
      errorMsg: {
        summary: 'cost-of-taxi-journeys:validation.required',
        inline: 'cost-of-taxi-journeys:validation.required',
      },
    }),
    r.regex.make({
      pattern: CURRENCY,
      errorMsg: {
        summary: 'cost-of-taxi-journeys:validation.invalid',
        inline: 'cost-of-taxi-journeys:validation.invalid',
      },
    }),
    r.regex.make({
      pattern: REJECT_ZERO_VALUES,
      errorMsg: {
        summary: 'cost-of-taxi-journeys:validation.zero',
        inline: 'cost-of-taxi-journeys:validation.zero',
      },
    }), 
  ]),
};

module.exports = fieldValidators;
