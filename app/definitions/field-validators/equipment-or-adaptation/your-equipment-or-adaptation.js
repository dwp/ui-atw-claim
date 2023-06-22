const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const equipmentOrAdaptationsList = require('../../../custom-validators/equipment-or-adaptation-list-validation');

const fieldValidators = {
  item: sf([
    equipmentOrAdaptationsList,
  ]),
};

module.exports = fieldValidators;
