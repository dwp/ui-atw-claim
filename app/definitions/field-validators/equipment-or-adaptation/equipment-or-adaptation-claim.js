const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  claimingEquipment: sf([
    r.required.make({
      errorMsg: {
        summary: 'equipment-or-adaptation-claim:required',
        inline: 'equipment-or-adaptation-claim:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
