const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  address: sf([
    r.postalAddressObject.make({
      // Limit the length of each address line (address1 - 4)
      strlenmax: 100,
      requiredFields: ['address1', 'address3', 'postcode'],
      errorMsgAddress1: {
        summary: 'enter-address-of-person-or-company-being-paid:address1.validation.required.summary',
        focusSuffix: '[address1]',
      },
      errorMsgAddress2: {
        summary: 'validation:rule.postalAddressObject.address2.summary',
        focusSuffix: '[address2]',
      },
      errorMsgAddress3: {
        summary: 'enter-address-of-person-or-company-being-paid:address3.validation.required.summary',
        focusSuffix: '[address3]',
      },
      errorMsgAddress4: {
        summary: 'validation:rule.postalAddressObject.address4.summary',
        focusSuffix: '[address4]',
      },
      errorMsgPostcode: {
        summary: 'enter-address-of-person-or-company-being-paid:postcode.validation.required.summary',
        focusSuffix: '[postcode]',
      },
    }),

  ]),
};
module.exports = fieldValidators;
