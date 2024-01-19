const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  addAnother: sf([
      r.required.make({
        errorMsg: {
          summary: 'vehicle-adaptations-summary:required',
          inline: 'vehicle-adaptations-summary:required',
        },
      }),
    ]),
  };
module.exports = fieldValidators;
