const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removeMonthOfTravel: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-month-of-tiw:required',
      },
    }),
  ])
};

module.exports = fieldValidators;
