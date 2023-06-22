const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  claimingTravelToWork: sf([
    r.required.make({
      errorMsg: {
        summary: 'work-travel-claim:required',
        inline: 'work-travel-claim:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
