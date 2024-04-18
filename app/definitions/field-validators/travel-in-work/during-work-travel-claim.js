const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  claimingTravelInWork: sf([
    r.required.make({
      errorMsg: {
        summary: 'during-work-travel-claim:required',
        inline: 'during-work-travel-claim:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
