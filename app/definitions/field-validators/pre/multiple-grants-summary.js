const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  selectClaimType: sf([
    r.required.make({
      errorMsg: {
        summary: 'multiple-grants-summary:errors.required',
        inline: 'multiple-grants-summary:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
