const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  journeysOrMileage: sf([
    r.required.make({
      errorMsg: {
        summary: 'journey-or-mileage:required',
        inline: 'journey-or-mileage:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
