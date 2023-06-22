const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const travelListValidation = require('../../../custom-validators/travel-list-validation');

const fieldValidators = {
  day: sf([
    travelListValidation,
  ]),
};

module.exports = fieldValidators;
