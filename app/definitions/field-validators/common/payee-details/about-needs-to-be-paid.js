const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  fullName: sf([
    r.required.make({
      errorMsg: {
        summary: 'about-needs-to-be-paid:inputs.fullName.errors.required',
        inline: 'about-needs-to-be-paid:inputs.fullName.errors.required',
      },
    }),
  ]),
  emailAddress: sf([
    r.required.make({
      errorMsg: {
        summary: 'about-needs-to-be-paid:inputs.emailAddress.errors.required',
        inline: 'about-needs-to-be-paid:inputs.emailAddress.errors.required',
      },
    }),
    r.email.make({
      errorMsg: {
        summary: 'about-needs-to-be-paid:inputs.emailAddress.errors.invalid',
        inline: 'about-needs-to-be-paid:inputs.emailAddress.errors.invalid',
      },
    }),

  ]),
};

module.exports = fieldValidators;
