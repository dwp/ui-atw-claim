const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removeMonthOfSupport: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-month-of-support:required',
      },
    }),
  ]),
  removeId: sf([
    r.required,
  ]),
};

module.exports = fieldValidators;
