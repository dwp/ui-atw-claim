const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  selectJob: sf([
    r.required.make({
      errorMsg: {
        summary: 'multiple-job-select:errors.required',
        inline: 'multiple-job-select:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
