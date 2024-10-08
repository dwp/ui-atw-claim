const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const config = require('../../../../../../app/config/config-mapping');
const validators = require(
  '../../../../../../app/definitions/field-validators/common/payee-details/postcode-of-person-or-company-being-paid');
const {
  expectValidatorToFailWithJourney, 
  expectValidatorToPass
} = require('../../../../../helpers/validator-assertions');

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
})();


describe('Validators: postcode-of-person-or-company-being-paid', () => {
  it('should export a function', () => {
    assert.typeOf(config, 'object');
  });

  describe('field: postcode', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFailWithJourney(
        validators,
        'person-company-being-paid-postcode',
        'postcode',
        'Required',
        new JourneyContext({
          ['person-company-being-paid-details']: {
            fullName: 'George',
          },
        }), {
          inline: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.required',
          summary: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.required',
        });
    });
    it('should fail "regex" validator if not postcode Format', async () => {
      await expectValidatorToFailWithJourney(
        validators,
        'person-company-being-paid-postcode',
        'postcode',
        'Regex',
        new JourneyContext({
          ['person-company-being-paid-details']: {
            fullName: 'George',
          },
          ['person-company-being-paid-postcode']: {
            postcode: 'Yes',
          },
        }), {
          inline: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.invalid',
          summary: 'postcode-of-person-or-company-being-paid:inputs.postcode.errors.invalid',
        });
    });
    it('should pass validator if value is provided', async () => {
      await expectValidatorToPass(
        validators,
        'postcode',
        'Required',
        { postcode: 'NE264RS' });
    });
    it('should pass validator if value is provided (with Space)', async () => {
      await expectValidatorToPass(
        validators,
        'postcode',
        'Required',
        { postcode: 'NE26 4RS' });
    });
  });
});

