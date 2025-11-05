const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  selectClaimType: sf([
    r.required.make({
      errorMsg: {
        summary: 'multiple-payments-claims-history:errors.required',
        inline: 'multiple-payments-claims-history:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
