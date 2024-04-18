const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const monthYearObject = require('../../../custom-validators/month-year-valdiator');

const fieldValidators = {
  monthIndex: sf([
    r.required,
  ]),
  dateOfTravel: sf([
    r.required.make({
      errorMsg: {
        summary: 'travel-claim-month:validation.requiredAll',
        inline: 'travel-claim-month:validation.requiredAll',
        focusSuffix: '[mm]',
      },
    }),
    monthYearObject.make({
      errorMsgBeforeOffset: {
        summary: 'travel-claim-month:validation.future',
        inline: 'travel-claim-month:validation.future',
        focusSuffix: '[mm]',
      },
    }),
  ]),
};

module.exports = fieldValidators;
