const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  claimingSupportWorker: sf([
    r.required.make({
      errorMsg: {
        summary: 'support-worker-claim:required',
        inline: 'support-worker-claim:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
