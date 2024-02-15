const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  daysOfSupport: sf([
    r.required.make({
      errorMsg: {
        summary: 'days-you-had-support:required',
        inline: 'days-you-had-support:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
