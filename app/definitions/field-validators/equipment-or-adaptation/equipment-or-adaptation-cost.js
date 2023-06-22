const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const regexDefinitions = require('../../../config/regex-definitions');

const fieldValidators = {
  totalCost: sf([
    r.required.make({
      errorMsg: {
        summary: 'equipment-or-adaptation-cost:validation.required',
        inline: 'equipment-or-adaptation-cost:validation.required',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.CURRENCY,
      errorMsg: {
        summary: 'equipment-or-adaptation-cost:validation.invalid',
        inline: 'equipment-or-adaptation-cost:validation.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
