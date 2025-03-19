const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const { PHONE_NUMBER } = require('../../../../config/regex-definitions');
const { ValidatorFactory, ValidationError } = require('@dwp/govuk-casa');

class PreventInvalidSaveValidator extends ValidatorFactory {
  validate(fieldValue, { waypointId, journeyContext }) {
    return new Promise((resolve, reject) => {
      const isValid = PHONE_NUMBER.test(fieldValue);

      if (!isValid) {
        const previousData = journeyContext.getDataForPage('new-phone-number-stash');

        journeyContext.setDataForPage(waypointId, previousData);

        // errorMsg regex kicks in so have left empty, acts same as resolve
        reject(new ValidationError({}))
      } else {
        resolve();
      }
    });
  }
}

const fieldValidators = {
  homeNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'new-phone-number:inputs.homeNumber.errors.required',
        inline: 'new-phone-number:inputs.homeNumber.errors.required',
      },
    }),
    r.regex.make({
      pattern: PHONE_NUMBER,
      errorMsg: {
        summary: 'new-phone-number:inputs.homeNumber.errors.invalid',
        inline: 'new-phone-number:inputs.homeNumber.errors.invalid',
      },
    }),
    new PreventInvalidSaveValidator(),
  ]),
};

module.exports = fieldValidators;
