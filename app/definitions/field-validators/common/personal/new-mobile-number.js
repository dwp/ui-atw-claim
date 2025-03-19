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
        const previousData = journeyContext.getDataForPage('new-mobile-number-stash');

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
  mobileNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'new-mobile-number:inputs.mobileNumber.errors.required',
        inline: 'new-mobile-number:inputs.mobileNumber.errors.required',
      },
    }),
    r.regex.make({
      pattern: PHONE_NUMBER,
      errorMsg: {
        summary: 'new-mobile-number:inputs.mobileNumber.errors.invalid',
        inline: 'new-mobile-number:inputs.mobileNumber.errors.invalid',
      },
    }),
    new PreventInvalidSaveValidator(),
  ]),
};

module.exports = fieldValidators;
