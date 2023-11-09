const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { claimTypesFullName } = require('../../../../config/claim-types');
const { EMAIL } = require('../../../../config/regex-definitions');

function getSuffix(journeyContext) {
  const { journeyType } = journeyContext.getDataForPage('__journey_type__');

  if (journeyType === claimTypesFullName.SW) {
    return 'support-worker';
  }
  if (journeyType === claimTypesFullName.TW) {
    return 'travel-to-work';
  }
  throw new Error(`Unsupported journey type ${journeyType}`);
}

const fieldValidators = {
  fullName: sf([
    r.required.make({
      errorMsg: ({ journeyContext }) => {
        const suffix = getSuffix(journeyContext);
        return {
          summary: `details-of-someone-who-can-confirm-costs:inputs.fullName.errors.required.${suffix}`,
          inline: `details-of-someone-who-can-confirm-costs:inputs.fullName.errors.required.${suffix}`,
        };
      },
    }),
  ]),
  emailAddress: sf([
    r.required.make({
      errorMsg: ({ journeyContext }) => {
        const suffix = getSuffix(journeyContext);
        return {
          summary: `details-of-someone-who-can-confirm-costs:inputs.emailAddress.errors.required.${suffix}`,
          inline: `details-of-someone-who-can-confirm-costs:inputs.emailAddress.errors.required.${suffix}`,
        };
      },
    }),
    r.regex.make({
      pattern: EMAIL,
      errorMsg: {
        summary: 'details-of-someone-who-can-confirm-costs:inputs.emailAddress.errors.invalid',
        inline: 'details-of-someone-who-can-confirm-costs:inputs.emailAddress.errors.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
