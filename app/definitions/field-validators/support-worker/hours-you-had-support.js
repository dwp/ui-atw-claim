const {
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const supportWorkerTimeValidation = require('../../../custom-validators/support-worker-time-validation');

const fieldValidators = {
  hours: sf([
    supportWorkerTimeValidation,
  ]),
};

module.exports = fieldValidators;
