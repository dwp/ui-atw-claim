const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  anotherMonth: sf([
    r.required.make({
      errorMsg: ({ journeyContext }) => {
        const showMileageErrors = journeyContext
          .getDataForPage('journey-or-mileage')?.journeysOrMileage === 'mileage';

        const errorKey = showMileageErrors ? 'mileage' : 'journeys';

        return {
          summary: `journey-summary:errors.${errorKey}.required`,
          inline: `journey-summary:errors.${errorKey}.required`,
        };
      },
    }),
  ], ({
    journeyContext,
  }) => journeyContext.getDataForPage('remove-month-of-travel')?.removeId === undefined),
};
module.exports = fieldValidators;
