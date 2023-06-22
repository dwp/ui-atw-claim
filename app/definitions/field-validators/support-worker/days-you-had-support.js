const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const supportWorkerListValidation = require('../../../custom-validators/support-worker-list-validation');

const fieldValidators = {
  day: sf([
    supportWorkerListValidation,
  ]),
};

module.exports = fieldValidators;
