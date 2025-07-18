const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removeVehicleAdaptation: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-vehicle-adaptations:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
