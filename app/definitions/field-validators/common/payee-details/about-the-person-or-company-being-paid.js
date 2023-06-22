const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  payee: sf([
    r.required.make({
      errorMsg: {
        summary: 'about-the-person-or-company-being-paid:errors.required',
        inline: 'about-the-person-or-company-being-paid:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
