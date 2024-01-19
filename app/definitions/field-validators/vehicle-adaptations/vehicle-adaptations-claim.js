const {
    validationRules: r,
    simpleFieldValidation: sf,
  } = require('@dwp/govuk-casa');
  
  const fieldValidators = {
    claimingAdaptationToVehicle: sf([
      r.required.make({
        errorMsg: {
          summary: 'vehicle-adaptations-claim:required',
          inline: 'vehicle-adaptations-claim:required',
        },
      }),
    ]),
  };
  
  module.exports = fieldValidators;
  