const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { NAME } = require('../../../../config/regex-definitions');

const fieldValidators = {
  firstName: sf([
    r.required.make({
      errorMsg: {
        summary: 'update-name:inputs.firstName.errors.required',
        inline: 'update-name:inputs.firstName.errors.required',
      },
    }),
    r.regex.make({
      pattern: NAME,
      errorMsg: {
        summary: 'update-name:inputs.firstName.errors.invalid',
        inline: 'update-name:inputs.firstName.errors.invalid',
      },
    }),
  ]),
  lastName: sf([
    r.required.make({
      errorMsg: {
        summary: 'update-name:inputs.lastName.errors.required',
        inline: 'update-name:inputs.lastName.errors.required',
      },
    }),
    r.regex.make({
      pattern: NAME,
      errorMsg: {
        summary: 'update-name:inputs.lastName.errors.invalid',
        inline: 'update-name:inputs.lastName.errors.invalid',
      },
    }),
  ]),
};

module.exports = fieldValidators;
