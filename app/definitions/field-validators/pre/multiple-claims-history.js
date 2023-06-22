const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  selectClaimType: sf([
    r.required.make({
      errorMsg: {
        summary: 'multiple-claims-history:errors.required',
        inline: 'multiple-claims-history:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
