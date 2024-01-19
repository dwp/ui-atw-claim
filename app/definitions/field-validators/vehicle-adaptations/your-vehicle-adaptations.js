const {
    simpleFieldValidation: sf,
  } = require('@dwp/govuk-casa');
  
  const VehicleAdaptationsList = require('../../../custom-validators/vehicle-adaptation-list-validation');
  
  const fieldValidators = {
    item: sf([
      VehicleAdaptationsList,
    ]),
  };
  
  module.exports = fieldValidators;
  