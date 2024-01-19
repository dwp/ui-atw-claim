const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removeVehicleAdaptation: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-vehicle-adaptation:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
