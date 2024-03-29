const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  anotherMonth: sf([
    r.required.make({
      errorMsg: {
        summary: 'support-claim-summary:required',
        inline: 'support-claim-summary:required',
      },
    }),
  ])
};
module.exports = fieldValidators;
