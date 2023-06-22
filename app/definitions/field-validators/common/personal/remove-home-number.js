const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removingHomeNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-home-number:required',
        inline: 'remove-home-number:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
