const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  employmentStatus: sf([
    r.required.make({
      errorMsg: {
        summary: 'employment-status:required',
        inline: 'employment-status:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
