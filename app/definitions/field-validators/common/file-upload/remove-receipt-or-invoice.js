const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removingEntry: sf([
    r.required.make({
      errorMsg: {
        summary: 'Select yes if you want to remove this receipt or invoice',
      },
    }),
  ]),
};

module.exports = fieldValidators;
