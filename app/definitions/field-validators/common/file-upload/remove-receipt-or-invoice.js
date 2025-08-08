const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removingEntry: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-receipt-or-invoice:errors.required',
        inline: 'remove-receipt-or-invoice:errors.required'
      },
    }),
  ]),
};

module.exports = fieldValidators;
