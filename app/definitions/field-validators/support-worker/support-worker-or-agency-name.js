const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  supportWorkerOrAgencyName: sf([
    r.required.make({
      errorMsg: {
        summary: 'support-worker-or-agency-name:required',
        inline: 'support-worker-or-agency-name:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
