const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  addAnother: sf([
      r.required.make({
        errorMsg: {
          summary: 'equipment-or-adaptation-summary:required',
          inline: 'equipment-or-adaptation-summary:required',
        },
      }),
    ]),
  };
module.exports = fieldValidators;
