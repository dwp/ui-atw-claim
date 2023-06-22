const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  selectSupportToClaim: sf([
    r.required.make({
      errorMsg: {
        summary: 'select-support-to-claim:errors.required',
        inline: 'select-support-to-claim:errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
