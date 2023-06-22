const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removingMobileNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-mobile-number:required',
        inline: 'remove-mobile-number:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
