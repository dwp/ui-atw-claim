const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const tiwJourneysValidation = require('../../../custom-validators/tiw-day-list-validation');

const fieldValidators = {
  dateOfTravel: sf([
    tiwJourneysValidation,
  ]),
};

module.exports = fieldValidators;
