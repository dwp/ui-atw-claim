const {
  expectValidatorToFail,
  expectValidatorToPass
} = require('../../../../../helpers/validator-assertions');
const validators = require('../../../../../../app/definitions/field-validators/common/optional-validator');
const { assert } = require('chai');
const config = require('../../../../../../app/config/config-mapping');

describe('Validators: your-equipment-or-adaptation-grant', () => {
  it('should export a function', () => {
    assert.typeOf(config, 'object');
  });

  describe('field: reviewed', () => {
    it('should pass "optional" - if empty', async () => {
      await expectValidatorToPass(
        validators,
        'reviewed',
        'Optional',
        { reviewed: '' });
    });

    it('should pass "optional" - if any value', async () => {
      await expectValidatorToPass(
        validators,
        'reviewed',
        'Optional',
        { reviewed: 'VALUE' });
    });
  });
});

