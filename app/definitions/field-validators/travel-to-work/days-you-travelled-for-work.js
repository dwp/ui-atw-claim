const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const ttwJourneysValidation = require('../../../custom-validators/ttw-day-list-validation');

const fieldValidators = {
  dateOfTravel: sf([
    ttwJourneysValidation,
  ]),
};

module.exports = fieldValidators;
