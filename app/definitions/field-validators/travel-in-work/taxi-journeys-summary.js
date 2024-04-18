const {
    validationRules: r,
    simpleFieldValidation: sf,
  } = require('@dwp/govuk-casa');

const fieldValidators = {
    anotherMonth: sf([
        r.required.make({
            errorMsg: {
                summary: 'taxi-journeys-summary:required',
                inline: 'taxi-journeys-summary:required',
            },
        }),
    ])
};

  module.exports = fieldValidators;
