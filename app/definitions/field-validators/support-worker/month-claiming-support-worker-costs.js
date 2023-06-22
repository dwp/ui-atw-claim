const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const monthYearObject = require('../../../custom-validators/month-year-valdiator');

const fieldValidators = {
  monthIndex: sf([
    r.required,
  ]),
  dateOfSupport: sf([
    r.required.make({
      errorMsg: {
        summary: 'month-claiming-support-worker-costs:validation.requiredAll',
        inline: 'month-claiming-support-worker-costs:validation.requiredAll',
        focusSuffix: '[mm]',
      },
    }),
    monthYearObject.make({
      errorMsgBeforeOffset: {
        summary: 'month-claiming-support-worker-costs:validation.future',
        inline: 'month-claiming-support-worker-costs:validation.future',
        focusSuffix: '[mm]',
      },
    }),
  ]),
};

module.exports = fieldValidators;
