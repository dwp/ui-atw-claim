const {
    simpleFieldValidation: sf,
  } = require('@dwp/govuk-casa');

  const tiwJourneyDetailsValidation = require('../../../custom-validators/tiw-journey-details-validation');

  const fieldValidators = {
    journeyDetails: sf([
        tiwJourneyDetailsValidation,
    ]),
  };

  module.exports = fieldValidators;
