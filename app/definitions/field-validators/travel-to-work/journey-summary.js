const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  anotherMonth: sf([
    r.required.make({
      errorMsg: ({ journeyContext }) => {
        const showMileageErrors = journeyContext
          .getDataForPage('journeys-miles')?.journeysOrMileage === 'mileage';

        const errorKey = showMileageErrors ? 'mileage' : 'journeys';

        return {
          summary: `journey-summary:errors.${errorKey}.required`,
          inline: `journey-summary:errors.${errorKey}.required`,
        };
      },
    }),
  ]),
};
module.exports = fieldValidators;
