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
        summary: 'month-claiming-travel-for-work:validation.requiredAll',
        inline: 'month-claiming-travel-for-work:validation.requiredAll',
        focusSuffix: '[mm]',
      },
    }),
    monthYearObject.make({
      errorMsgBeforeOffset: {
        summary: 'month-claiming-travel-for-work:validation.future',
        inline: 'month-claiming-travel-for-work:validation.future',
        focusSuffix: '[mm]',
      },
    }),
  ]),
};

module.exports = fieldValidators;
