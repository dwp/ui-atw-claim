const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  howDidYouTravelForWork: sf([
    r.required.make({
      errorMsg: {
        summary: 'how-did-you-travel-for-work:required',
        inline: 'how-did-you-travel-for-work:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
