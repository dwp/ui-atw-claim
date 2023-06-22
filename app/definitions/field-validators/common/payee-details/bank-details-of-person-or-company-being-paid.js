const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const regexDefinitions = require('../../../../config/regex-definitions');
const sortCode = require('../../../../custom-validators/sort-code-validator');

const fieldValidators = {
  accountHolderName: sf([
    r.required.make({
      errorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:accountHolderName.validation.required.inline',
        summary: 'bank-details-of-person-or-company-being-paid:accountHolderName.validation.required.summary',
      },
    }),
  ]),
  sortCode: sf([
    r.required.make({
      errorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:sortCode.validation.required.inline',
        summary: 'bank-details-of-person-or-company-being-paid:sortCode.validation.required.summary',
      },
    }),
    sortCode.bind({
      errorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:sortCode.validation.invalid.inline',
        summary: 'bank-details-of-person-or-company-being-paid:sortCode.validation.invalid.summary',
      },
      invalidLengthErrorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:sortCode.validation.invalidLength.inline',
        summary: 'bank-details-of-person-or-company-being-paid:sortCode.validation.invalidLength.summary',
      },
    }),
  ]),
  accountNumber: sf([
    r.required.make({
      errorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.required.inline',
        summary: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.required.summary',
      },
    }),
    r.strlen.make({
      max: 8,
      errorMsgMax: {
        inline: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.tooLong.inline',
        summary: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.tooLong.summary',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.NUMBER_REGEX,
      errorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.invalidChars.inline',
        summary: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.invalidChars.summary',
      },
    }),
    r.strlen.make({
      min: 6,
      errorMsgMin: {
        inline: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.tooShort.inline',
        summary: 'bank-details-of-person-or-company-being-paid:accountNumber.validation.tooShort.summary',
      },
    }),
  ]),
  rollNumber: sf([
    r.strlen.make({
      max: 18,
      errorMsgMax: {
        inline: 'bank-details-of-person-or-company-being-paid:rollNumber.validation.tooLong.inline',
        summary: 'bank-details-of-person-or-company-being-paid:rollNumber.validation.tooLong.summary',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.ROLL_NUMBER_CHARS,
      errorMsg: {
        inline: 'bank-details-of-person-or-company-being-paid:rollNumber.validation.invalid.inline',
        summary: 'bank-details-of-person-or-company-being-paid:rollNumber.validation.invalid.summary',
      },
    }),
  ]),
};

module.exports = fieldValidators;
