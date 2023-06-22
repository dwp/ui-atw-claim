const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  emailAddress: sf([
    r.required.make({
      errorMsg: {
        summary: 'update-your-email-address:inputs.emailAddress.errors.required',
        inline: 'update-your-email-address:inputs.emailAddress.errors.required',
      },
    }),
    r.email.make({
      errorMsg: {
        summary: 'update-your-email-address:inputs.emailAddress.errors.invalid',
        inline: 'update-your-email-address:inputs.emailAddress.errors.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
