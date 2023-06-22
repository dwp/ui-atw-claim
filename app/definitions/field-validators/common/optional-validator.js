const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  reviewed: sf([
    r.optional,
  ]),
};

module.exports = fieldValidators;
