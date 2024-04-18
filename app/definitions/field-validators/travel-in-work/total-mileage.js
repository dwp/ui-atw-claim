const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const totalMileageObject = require('../../../custom-validators/total-mileage-validation');

const fieldValidators = {
  totalMileage: sf([totalMileageObject]),
};

module.exports = fieldValidators;  