const {
  expectValidatorToFailWithJourney,
  expectValidatorToPass,
} = require('../../../../../helpers/validator-assertions');
const validators = require(
  '../../../../../../app/definitions/field-validators/common/payee-details/postcode-of-person-or-company-being-paid');
const { assert } = require('chai');
const config = require('../../../../../../app/config/config-mapping');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

describe('Validators: postcode-of-person-or-company-being-paid', () => {
  it('should export a function', () => {
    assert.typeOf(config, 'object');
  });

  describe('field: postcode', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFailWithJourney(
        validators,
        'postcode-of-person-or-company-being-paid',
        'postcode',
        'Required',
        new JourneyContext({
          ['about-needs-to-be-paid']: {
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
        'postcode-of-person-or-company-being-paid',
        'postcode',
        'Regex',
        new JourneyContext({
          ['about-needs-to-be-paid']: {
            fullName: 'George',
          },
          ['postcode-of-person-or-company-being-paid']: {
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

