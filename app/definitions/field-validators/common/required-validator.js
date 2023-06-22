const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  reviewed: sf([
    r.required,
  ]),
};

module.exports = fieldValidators;
