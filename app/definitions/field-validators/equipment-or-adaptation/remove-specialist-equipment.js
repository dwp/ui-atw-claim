const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  removeSpecialistEquipment: sf([
    r.required.make({
      errorMsg: {
        summary: 'remove-specialist-equipments:required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
