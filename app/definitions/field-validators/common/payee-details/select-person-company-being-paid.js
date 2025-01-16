const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  bankDetails: sf([
    r.required.make({
      errorMsg: {
        summary: 'select-person-company-being-paid:errors.required',
        inline: 'select-person-company-being-paid:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
